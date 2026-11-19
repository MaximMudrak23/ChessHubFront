import type { Game } from '@/store/gameStore';
import type { Player } from '@/pages/GamePage/utils/types/game.types';
import type { GameStatus } from '@/pages/GamePage/components/ChessBoard/utils/types/chess.types';

type ServerPlayer = {
    playerType: Player['type'];
    playerId: string;
    name: string;
    elo: number;
    avatarURL?: string;
    avatarFrameURL?: string;
    userIcons?: Player['userIcons'];
};

export type ServerGame = {
    _id: string;
    white: ServerPlayer;
    black: ServerPlayer;
    currentTurn: Game['currentTurn'];
    status: string;
    finishedReason?: GameStatus;
    moves?: Game['moves'];
    pieces?: Game['pieces'];
    lastMove?: Game['lastMove'];
    halfmoveClock?: number;
    fullmoveNumber?: number;
    positionHistory?: string[];
    winner?: Game['winner'];
    moveMeta?: Game['moveMeta'];
};

export function mapServerGameToClientGame(serverGame: ServerGame): Game {
    return {
        gameId: String(serverGame._id),
        isActive: serverGame.status === 'active',

        players: {
            white: {
                type: serverGame.white.playerType,
                userId: String(serverGame.white.playerId),
                side: 'white',
                userName: serverGame.white.name,
                userElo: serverGame.white.elo,
                imgURL: serverGame.white.avatarURL,
                frameURL: serverGame.white.avatarFrameURL,
                userIcons: serverGame.white.userIcons,
            },

            black: {
                type: serverGame.black.playerType,
                userId: String(serverGame.black.playerId),
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
        pieces: serverGame.pieces ?? [],
        lastMove: serverGame.lastMove ?? null,
        halfmoveClock: serverGame.halfmoveClock ?? 0,
        fullmoveNumber: serverGame.fullmoveNumber ?? 1,
        positionHistory: serverGame.positionHistory ?? null,

        gameStatus:
            serverGame.status === 'finished'
                ? serverGame.finishedReason ?? 'playing'
                : 'playing',

        winner: serverGame.winner ?? null,

        moveMeta: serverGame.moveMeta ?? null,
    };
}
