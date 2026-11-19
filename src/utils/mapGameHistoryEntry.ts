import type { GameHistoryGameDTO, GameHistoryPlayerDTO } from '@/types/gameHistory.types';
import type { GameHistoryEntry, GameHistoryPlayer } from '@/pages/MainPage/components/GameHistory/types';

function mapPlayer(player: GameHistoryPlayerDTO): GameHistoryPlayer {
    return {
        name: player.name?.trim() || 'Unknown player',
        avatarURL: player.avatarURL ?? undefined,
        eloAtStart: player.elo,
    };
}

export function mapGameHistoryEntry(game: GameHistoryGameDTO): GameHistoryEntry {
    return {
        ...game,
        white: mapPlayer(game.white),
        black: mapPlayer(game.black),
    };
}
