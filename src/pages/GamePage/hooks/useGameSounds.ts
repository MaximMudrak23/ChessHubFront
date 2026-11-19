import { useEffect } from 'react';
import { useGameStore, type GameStore } from '@/store/gameStore';
import { playSound, type SoundName } from '../components/ChessBoard/utils/lib/playSound';
import { getNavigationPly, getPositionAtPly } from '../utils/moveNavigation';

function liveMoveSound(meta: GameStore['moveMeta']): Exclude<SoundName, 'game-end'> {
    if (meta?.isCheck || meta?.isCheckmate) return 'move-check';
    if (meta?.isPromotion) return 'promote';
    if (meta?.isCastling) return 'castle';
    return meta?.isCapture ? 'capture' : 'move-self';
}

export function getGameSound(state: GameStore, previous: GameStore, gameId?: string): SoundName | null {
    if (!gameId || state.gameId !== gameId || previous.gameId !== gameId) return null;
    const ply = getNavigationPly(state);
    const previousPly = getNavigationPly(previous);
    // Loading a finished game is silent. Live completion takes priority over the move sound.
    if (previous.isActive && !state.isActive && !state.variation && !previous.variation &&
        state.selectedPly === null && previous.selectedPly === null) {
        return 'game-end';
    }
    if (ply === previousPly) return null;
    const transitionPly = ply < previousPly ? previousPly : ply;
    const transition = getPositionAtPly(ply < previousPly ? previous : state, transitionPly);
    return transition?.sound ?? liveMoveSound(state.moveMeta);
}

export function useGameSounds(gameId?: string) {
    useEffect(() => useGameStore.subscribe((state, previous) => {
        const sound = getGameSound(state, previous, gameId);
        if (sound) playSound(sound);
    }), [gameId]);
}
