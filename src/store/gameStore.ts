import { create } from 'zustand';
import type { Players, Side, Move } from '@/pages/GamePage/utils/types/game.types';

export type Game = {
    gameId: string;
    players: Players;
    currentTurn: Side;
    moves: Move[];
    halfmoveClock: number;
    fullmoveNumber: number;
    positionHistory: string[];
};

export type GameStore = {
    gameId: string | null;
    players: Players | null;
    currentTurn: Side;
    moves: Move[];
    halfmoveClock: number;
    fullmoveNumber: number;
    positionHistory: string[];
    setPositionHistory: (value: string[] | ((cur: string[]) => string[])) => void;

    setGame: (game: Game) => void;
    setCurrentTurn: (value: Side | ((cur: Side) => Side)) => void;
    setMoves: (value: Move[] | ((cur: Move[]) => Move[])) => void;
    clearGame: () => void;

    setHalfmoveClock: (value: number | ((cur: number) => number)) => void;
    setFullmoveNumber: (value: number | ((cur: number) => number)) => void;
};

export const useGameStore = create<GameStore>((set) => ({
    gameId: null,
    players: null,
    currentTurn: 'white',
    moves: [],
    halfmoveClock: 0,
    fullmoveNumber: 1,
    positionHistory: [],

    setGame: (game) => set({
        gameId: game.gameId,
        players: game.players,
        currentTurn: game.currentTurn,
        moves: game.moves,
        halfmoveClock: game.halfmoveClock,
        fullmoveNumber: game.fullmoveNumber,
        positionHistory: game.positionHistory,
    }),

    setCurrentTurn: (value) =>
        set((state) => ({
            currentTurn:
                typeof value === 'function'
                    ? value(state.currentTurn)
                    : value,
        })),

    setMoves: (value) =>
        set((state) => ({
            moves:
                typeof value === 'function'
                    ? value(state.moves)
                    : value,
        })),

    clearGame: () => set({
        gameId: null,
        players: null,
        currentTurn: 'white',
        moves: [],
        halfmoveClock: 0,
        fullmoveNumber: 1,
        positionHistory: [],
    }),

    setHalfmoveClock: (value) =>
        set((state) => ({
            halfmoveClock:
                typeof value === 'function'
                    ? value(state.halfmoveClock)
                    : value,
    })),

    setFullmoveNumber: (value) =>
        set((state) => ({
            fullmoveNumber:
                typeof value === 'function'
                    ? value(state.fullmoveNumber)
                    : value,
    })),

    setPositionHistory: (value) =>
    set((state) => ({
        positionHistory:
            typeof value === 'function'
                ? value(state.positionHistory)
                : value,
    })),
}));