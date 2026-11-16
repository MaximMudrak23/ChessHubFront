import { useEffect } from 'react';

import { socket, getSocketSessionVersion } from '@/socket/socket';
import { isObjectId, subscribeToSocketState } from '@/socket/subscribeToSocketState';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { getGameById } from '@/api/gameApi';
import { mapServerGameToClientGame, type ServerGame } from '@/utils/mapServerGameToClientGame';

export function useGameSocket(gameId?: string) {
    const setGame = useGameStore(s => s.setGame);
    const token = useUserStore(s => s.token);
    const userId = useUserStore(s => s.user?.id);

    useEffect(() => {
        if (!gameId || !isObjectId(gameId)) return;
        const session = getSocketSessionVersion();
        const unsubscribe = subscribeToSocketState<ServerGame>({
            event: 'game:update',
            join: () => { socket.emit('game:join', gameId); },
            leave: () => { socket.emit('game:leave', gameId); },
            loadSnapshot: async () => (await getGameById(gameId)).game,
            accepts: game => String(game._id) === gameId,
            onUpdate: game => setGame(mapServerGameToClientGame(game)),
        });

        return () => {
            unsubscribe();
            const game = useGameStore.getState();
            const isParticipant = game.players && Object.values(game.players).some(player => player.userId === userId);
            if (session === getSocketSessionVersion() && game.gameId === gameId && !isParticipant) {
                game.clearGame();
            }
        };
    }, [gameId, token, userId, setGame]);
}
