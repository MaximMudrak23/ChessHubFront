import { useEffect } from 'react';

import { socket } from '@/socket/socket';
import { useGameStore } from '@/store/gameStore';
import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame';

export function useGameSocket(gameId: string | null) {
    const setGame = useGameStore(s => s.setGame);

    useEffect(() => {
        if (!gameId) return;

        socket.connect();
        socket.emit('game:join', gameId);

        socket.on('game:update', (game) => {
            console.log('SOCKET GAME UPDATE:', game.currentTurn, game.lastMove);
            setGame(mapServerGameToClientGame(game));
        });

        return () => {
            socket.emit('game:leave', gameId);
            socket.off('game:update');
        };
    }, [gameId, setGame]);
}