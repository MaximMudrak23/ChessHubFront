import type { Players, Side } from "../../../utils/types/game.types";

export function getSortedUsers(players: Players, perspective: Side) {
    return perspective === 'white' ? [players.black, players.white] : [players.white, players.black];
}