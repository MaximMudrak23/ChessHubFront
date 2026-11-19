import { create } from 'zustand';
import type { Players, Side, Move } from '@/pages/GamePage/utils/types/game.types';
import type { PieceType, PieceCode, Square, PromotionPiece } from '@/pages/GamePage/components/ChessBoard/utils/types/chess.types';
import type { GameStatus } from '@/pages/GamePage/components/ChessBoard/utils/types/chess.types';
import {
    canAnalyzePosition, countPlies, getLastNavigationPly, getNavigationPly, getNavigationPositions, getPositionAtPly,
    type BoardPosition, type NavigationCommand, type Variation,
} from '@/pages/GamePage/utils/moveNavigation';
import { applyAnalysisMove } from '@/pages/GamePage/utils/analysisVariation';

type MoveMeta = {
    isCapture: boolean;
    isCastling: boolean;
    isPromotion: boolean;
    isCheck: boolean;
    isCheckmate: boolean;
};

export type Game = {
    gameId: string;
    isActive: boolean;
    players: Players;
    currentTurn: Side;
    moves: Move[];
    pieces: PieceType[];
    lastMove: {
        piece: PieceCode;
        from: Square;
        to: Square;
    } | null;
    halfmoveClock: number;
    fullmoveNumber: number;
    positionHistory: string[] | null;
    gameStatus: GameStatus;
    moveMeta: MoveMeta | null;
    winner: Side | 'draw' | null;
};

export type GameStore = {
    gameId: string | null;
    isActive: boolean;
    // null follows the latest position; a number pins a historical half-move.
    selectedPly: number | null;
    latestPly: number;
    navigationPositions: BoardPosition[] | null;
    variation: Variation | null;
    viewRevision: number;
    revision: number;
    isMovePending: boolean;
    moveError: string | null;
    players: Players | null;
    currentTurn: Side;
    moves: Move[];
    pieces: PieceType[];
    lastMove: {
        piece: PieceCode;
        from: Square;
        to: Square;
    } | null;
    halfmoveClock: number;
    fullmoveNumber: number;
    positionHistory: string[] | null;
    gameStatus: GameStatus;
    moveMeta: MoveMeta | null;
    winnerSide: Side | null;

    setGame: (game: Game) => void;
    clearGame: () => void;
    selectPly: (ply: number) => void;
    navigatePosition: (command: NavigationCommand) => void;
    moveInVariation: (pieceID: string, targetSquare: Square, promotion?: PromotionPiece) => boolean;
};

export const useGameStore = create<GameStore>((set) => ({
    gameId: null,
    isActive: false,
    selectedPly: null,
    latestPly: 0,
    navigationPositions: null,
    variation: null,
    viewRevision: 0,
    revision: 0,
    isMovePending: false,
    moveError: null,
    players: null,
    currentTurn: 'white',
    moves: [],
    pieces: [],
    lastMove: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
    positionHistory: [],
    gameStatus: 'playing',
    moveMeta: null,
    winnerSide: null,

    setGame: (game) => set(state => {
        const latestPly = countPlies(game.moves);
        const navigationPositions = getNavigationPositions(game.moves, game.positionHistory);
        const sameGame = state.gameId === game.gameId;
        const variation = sameGame && navigationPositions && state.variation && state.variation.rootPly <= latestPly
            ? state.variation : null;
        return {
            gameId: game.gameId,
            isActive: game.isActive,
            latestPly,
            navigationPositions,
            variation,
            viewRevision: state.viewRevision + (!sameGame || (state.variation && !variation) ? 1 : 0),
            selectedPly: variation ? variation.rootPly
                : sameGame && navigationPositions && state.selectedPly !== null && state.selectedPly < latestPly
                    ? state.selectedPly : null,
            revision: state.revision + 1,
            isMovePending: sameGame && state.isMovePending,
            moveError: null,
            players: game.players,
            currentTurn: game.currentTurn,
            moves: game.moves,
            pieces: game.pieces,
            lastMove: game.lastMove,
            halfmoveClock: game.halfmoveClock,
            fullmoveNumber: game.fullmoveNumber,
            positionHistory: game.positionHistory,
            gameStatus: game.gameStatus,
            moveMeta: game.moveMeta,
            winnerSide:
                game.winner === 'white' || game.winner === 'black'
                    ? game.winner
                    : null,
        };
    }),

    selectPly: (ply) => set(state => {
        if (!state.navigationPositions || !Number.isFinite(ply)) return state;
        const nextPly = Math.max(0, Math.min(state.latestPly, Math.trunc(ply)));
        return { selectedPly: nextPly === state.latestPly ? null : nextPly, variation: null, viewRevision: state.viewRevision + 1 };
    }),

    navigatePosition: (command) => set(state => {
        if (!state.navigationPositions) return state;
        const current = getNavigationPly(state);
        const last = getLastNavigationPly(state);
        const target = { previous: current - 1, next: current + 1, start: 0, end: last }[command];
        const cursor = Math.max(0, Math.min(last, target));
        if (cursor === current) return state;
        return state.variation
            ? { variation: { ...state.variation, cursor }, viewRevision: state.viewRevision + 1 }
            : { selectedPly: cursor === state.latestPly ? null : cursor, viewRevision: state.viewRevision + 1 };
    }),

    moveInVariation: (pieceID, targetSquare, promotion) => {
        let moved = false;
        set(state => {
            if (!canAnalyzePosition(state)) return state;
            const cursor = getNavigationPly(state);
            const position = getPositionAtPly(state, cursor);
            if (!position) return state;
            // At the latest recorded position the board still uses the server's real IDs.
            const visiblePiece = position.pieces.find(p => p.id === pieceID) ??
                (state.selectedPly === null ? state.pieces.find(p => p.id === pieceID) : undefined);
            const piece = visiblePiece && position.pieces.find(p => p.square === visiblePiece.square && p.piece === visiblePiece.piece);
            if (!piece) return state;
            const next = applyAnalysisMove(position, piece.id, targetSquare, promotion);
            if (!next) return state;
            const existing = state.variation;
            const continueVariation = existing && cursor >= existing.rootPly;
            const rootPly = continueVariation ? existing.rootPly : cursor;
            const positions = continueVariation ? existing.positions.slice(0, cursor - rootPly + 1) : [position];
            moved = true;
            return {
                selectedPly: rootPly,
                variation: { rootPly, positions: [...positions, next], cursor: cursor + 1 },
                viewRevision: state.viewRevision + 1,
            };
        });
        return moved;
    },

    clearGame: () => set(state => ({
        gameId: null,
        isActive: false,
        selectedPly: null,
        latestPly: 0,
        navigationPositions: null,
        variation: null,
        viewRevision: state.viewRevision + 1,
        revision: state.revision + 1,
        isMovePending: false,
        moveError: null,
        players: null,
        currentTurn: 'white',
        moves: [],
        pieces: [],
        lastMove: null,
        halfmoveClock: 0,
        fullmoveNumber: 1,
        positionHistory: [],
        gameStatus: 'playing',
        moveMeta: null,
        winnerSide: null,
    })),
}));
