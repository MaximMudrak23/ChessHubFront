import { useEffect, useRef } from 'react';

import { finishGame } from '@/api/gameApi';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';

export function useFinishGame() {
    const token = useUserStore(s => s.token);
    const setUser = useUserStore(s => s.setUser);

    const gameId = useGameStore(s => s.gameId);
    const gameStatus = useGameStore(s => s.gameStatus);
    const currentTurn = useGameStore(s => s.currentTurn);
    const moves = useGameStore(s => s.moves);

    const hasFinishedGame = useRef(false);

    useEffect(() => {
        if (!token || !gameId) return;
        if (gameStatus === 'playing') return;
        if (hasFinishedGame.current) return;

        hasFinishedGame.current = true;

        const winner =
            gameStatus === 'checkmate'
                ? currentTurn === 'white'
                    ? 'black'
                    : 'white'
                : 'draw';

        finishGame(token, {
            gameId,
            winner,
            finishedReason: gameStatus,
            moves,
        })
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [gameStatus, token, gameId, currentTurn, moves]);
}