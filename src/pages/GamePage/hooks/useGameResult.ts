import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';

export function useGameResult() {
    const [isOpen, setIsOpen] = useState(false);
    const shownRef = useRef(false);

    useEffect(() => useGameStore.subscribe((state, previous) => {
        // Leaving the final position dismisses the result permanently for this visit.
        if (state.selectedPly !== previous.selectedPly) setIsOpen(false);
        if (shownRef.current || !previous.isActive || state.isActive ||
            state.gameId !== previous.gameId || state.selectedPly !== null || previous.selectedPly !== null) return;
        const user = useUserStore.getState().user;
        const isParticipant = user && state.players && Object.values(state.players).some(player =>
            player.userId === String(user.id));
        if (!isParticipant) return;
        shownRef.current = true;
        setIsOpen(true);
    }), []);

    return { isOpen, close: () => setIsOpen(false) };
}
