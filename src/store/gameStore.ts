import { create } from 'zustand';
import type { Players, Side, Move } from '@/pages/GamePage/utils/types/game.types';

export type Game = {
    gameId: string;
    players: Players;
    currentTurn: Side;
    moves: Move[];
};

export type GameStore = {
    gameId: string | null;
    players: Players | null;
    currentTurn: Side;
    moves: Move[];

    setGame: (game: Game) => void;
    setCurrentTurn: (value: Side | ((cur: Side) => Side)) => void;
    setMoves: (value: Move[] | ((cur: Move[]) => Move[])) => void;
    clearGame: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
    gameId: null,
    players: null,
    currentTurn: 'white',
    moves: [],

    setGame: (game) => set({
        gameId: game.gameId,
        players: game.players,
        currentTurn: game.currentTurn,
        moves: game.moves,
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
    }),
}));