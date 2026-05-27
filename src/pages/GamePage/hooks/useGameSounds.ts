import { useEffect, useRef } from 'react';

import { useGameStore } from '@/store/gameStore';
import { playSound } from '../components/ChessBoard/utils/lib/playSound';

export function useGameSounds() {
    const lastMove = useGameStore(s => s.lastMove);
    const moveMeta = useGameStore(s => s.moveMeta);
    const gameStatus = useGameStore(s => s.gameStatus);

    const prevLastMoveRef = useRef(lastMove);
    const prevGameStatusRef = useRef(gameStatus);

    useEffect(() => {
        if (!prevLastMoveRef.current && lastMove) {
            playSound('game-start');
            prevLastMoveRef.current = lastMove;
            return;
        }

        if (!lastMove || !moveMeta) return;

        if (moveMeta.isCheckmate) {
            playSound('game-end');
        } else if (moveMeta.isCheck) {
            playSound('move-check');
        } else if (moveMeta.isPromotion) {
            playSound('promote');
        } else if (moveMeta.isCastling) {
            playSound('castle');
        } else if (moveMeta.isCapture) {
            playSound('capture');
        } else {
            playSound('move-self');
        }

        prevLastMoveRef.current = lastMove;
    }, [lastMove, moveMeta]);

    useEffect(() => {
        if (
            prevGameStatusRef.current === 'playing' &&
            gameStatus !== 'playing'
        ) {
            playSound('game-end');
        }

        prevGameStatusRef.current = gameStatus;
    }, [gameStatus]);
}