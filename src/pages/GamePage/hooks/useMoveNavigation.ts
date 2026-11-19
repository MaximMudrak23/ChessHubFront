import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
    getLastNavigationPly, getNavigationPly, getPositionAtPly, isArrowInput, type NavigationCommand,
} from '../utils/moveNavigation';

export function useMoveNavigation(gameId?: string) {
    const selectedPly = useGameStore(s => s.selectedPly);
    const latestPly = useGameStore(s => s.latestPly);
    const navigationPositions = useGameStore(s => s.navigationPositions);
    const variation = useGameStore(s => s.variation);
    const viewRevision = useGameStore(s => s.viewRevision);
    const selectPly = useGameStore(s => s.selectPly);
    const navigatePosition = useGameStore(s => s.navigatePosition);

    useEffect(() => {
        function handleKey(event: KeyboardEvent) {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
                isArrowInput(event.target)) return;
            const state = useGameStore.getState();
            if (state.gameId !== gameId || !state.navigationPositions) return;
            const commands: Partial<Record<string, NavigationCommand>> = {
                ArrowLeft: 'previous', ArrowRight: 'next', ArrowDown: 'start', ArrowUp: 'end',
            };
            const command = commands[event.key];
            if (!command) return;
            event.preventDefault();
            state.navigatePosition(command);
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameId]);

    const state = { selectedPly, latestPly, navigationPositions, variation };
    const navigationPly = getNavigationPly(state);
    const position = variation || selectedPly !== null ? getPositionAtPly(state, navigationPly) : null;
    return {
        viewedPly: variation?.rootPly ?? selectedPly ?? latestPly,
        navigationPly,
        lastNavigationPly: getLastNavigationPly(state),
        latestPly,
        viewRevision,
        canNavigate: navigationPositions !== null,
        isVariation: variation !== null,
        animationPieces: position?.pieces ?? navigationPositions?.[navigationPly]?.pieces,
        position,
        selectPly,
        navigatePosition,
    };
}
