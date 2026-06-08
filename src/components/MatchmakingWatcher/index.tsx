import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { socket } from '@/socket/socket'
import { useUserStore } from '@/store/userStore';
import { useMatchmakingStore } from '@/store/matchmakingStore';

export default function MatchmakingWatcher() {
    const navigate = useNavigate();

    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);

    const isSearching = useMatchmakingStore(s => s.isSearching);
    const clearMatchmaking = useMatchmakingStore(s => s.clearMatchmaking);

    useEffect(() => {
        if (!isSearching || !user || !token) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('matchmaking:join', user.id);

        function handleMatchFound(gameId: string) {
            clearMatchmaking();
            navigate(`/game/${gameId}`);
        }

        socket.on('match:found', handleMatchFound);

        return () => {
            socket.emit('matchmaking:leave', user.id);
            socket.off('match:found', handleMatchFound);
        };
    }, [isSearching, user, token, clearMatchmaking, navigate]);

    return null;
}