import type { Players } from "@/pages/GamePage/utils/types/game.types";
import type { Game } from "@/store/gameStore";

const mockPlayers: Players = {
    white: {
        userId: 'zxc',
        side: 'white',
        userName: 'TAB ON ME',
        userElo: 2000,
        userIcons: [{ title: 'Developer', iconURL: '/svg/checkmark.svg' }],
    },

    black: {
        userId: 'bot-1',
        side: 'black',
        userName: 'Bot',
        userElo: 1000,
        userIcons: [{ title: 'Bot', iconURL: '/svg/checkmark.svg' }],
    },
};

export const mockGame: Game = {
    gameId: '1',
    players: mockPlayers,
    currentTurn: 'white',
    moves: [],
};