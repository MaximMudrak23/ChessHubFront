import type { Players } from "../types/game.types";

export function getCurrentUser(players: Players) {
    if (players.white.isCurrentUser) {
        return players.white;
    }
    if (players.black.isCurrentUser) {
        return players.black;
    }
    
    return null;
}