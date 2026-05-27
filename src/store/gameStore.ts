import { create } from 'zustand';
import type { Players, Side, Move } from '@/pages/GamePage/utils/types/game.types';
import type { PieceType, PieceCode, Square } from '@/pages/GamePage/components/ChessBoard/utils/types/chess.types';
import type { GameStatus } from '@/pages/GamePage/components/ChessBoard/utils/types/chess.types';

export type Game = {
    gameId: string;
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
    positionHistory: string[];
    gameStatus: GameStatus;
};

export type GameStore = {
    gameId: string | null;
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
    positionHistory: string[];
    gameStatus: GameStatus;

    setGame: (game: Game) => void;
    clearGame: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
    gameId: null,
    players: null,
    currentTurn: 'white',
    moves: [],
    pieces: [],
    lastMove: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
    positionHistory: [],
    gameStatus: 'playing',

    setGame: (game) => set({
        gameId: game.gameId,
        players: game.players,
        currentTurn: game.currentTurn,
        moves: game.moves,
        pieces: game.pieces,
        lastMove: game.lastMove,
        halfmoveClock: game.halfmoveClock,
        fullmoveNumber: game.fullmoveNumber,
        positionHistory: game.positionHistory,
        gameStatus: game.gameStatus,
    }),

    clearGame: () => set({
        gameId: null,
        players: null,
        currentTurn: 'white',
        moves: [],
        pieces: [],
        lastMove: null,
        halfmoveClock: 0,
        fullmoveNumber: 1,
        positionHistory: [],
        gameStatus: 'playing',
    }),
}));