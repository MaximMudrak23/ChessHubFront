import type { Game } from '@/store/gameStore';

export function mapServerGameToClientGame(serverGame: any): Game {
    return {
        gameId: serverGame._id,
        players: {
            white: {
                type: serverGame.white.playerType,
                userId: serverGame.white.playerId,
                side: 'white',
                userName: serverGame.white.name,
                userElo: serverGame.white.elo,
                imgURL: serverGame.white.avatarURL,
                frameURL: serverGame.white.avatarFrameURL,
                userIcons: serverGame.white.userIcons,
            },
            black: {
                type: serverGame.black.playerType,
                userId: serverGame.black.playerId,
                side: 'black',
                userName: serverGame.black.name,
                userElo: serverGame.black.elo,
                imgURL: serverGame.black.avatarURL,
                frameURL: serverGame.black.avatarFrameURL,
                userIcons: serverGame.black.userIcons,
            },
        },
        currentTurn: serverGame.currentTurn,
        moves: serverGame.moves ?? [],
        halfmoveClock: 0,
        fullmoveNumber: 1,
        positionHistory: [],
    };
}