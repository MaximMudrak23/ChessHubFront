import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { findGame } from '@/api/gameApi';
import { socket } from '@/socket/socket'
import { useUserStore } from '@/store/userStore';
import { useMatchmakingStore } from '@/store/matchmakingStore';
import { playGameStartOnce } from '@/pages/GamePage/components/ChessBoard/utils/lib/playSound';

export default function MatchmakingWatcher() {
    const navigate = useNavigate();

    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);

    const isSearching = useMatchmakingStore(s => s.isSearching);
    const setEloRange = useMatchmakingStore(s => s.setEloRange);
    const clearMatchmaking = useMatchmakingStore(s => s.clearMatchmaking);

    useEffect(() => {
        if (!isSearching || !user || !token) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('matchmaking:join', user.id);

        function handleMatchFound(gameId: string) {
            clearMatchmaking();
            playGameStartOnce(gameId);
            navigate(`/game/${gameId}`);
        }

        socket.on('match:found', handleMatchFound);

        return () => {
            socket.emit('matchmaking:leave', user.id);
            socket.off('match:found', handleMatchFound);
        };
    }, [isSearching, user, token, clearMatchmaking, navigate]);

    useEffect(() => {
        if (!isSearching || !token) return;

        const updateRange = async () => {
            try {
                const data = await findGame(token);

                if (data.status === 'searching') {
                    setEloRange(data.eloRange);
                }

                if (data.status === 'matched') {
                    const gameId = String(data.game._id);

                    clearMatchmaking();
                    playGameStartOnce(gameId);
                    navigate(`/game/${gameId}`);
                    return;
                }

                if (data.status === 'in_game') {
                    clearMatchmaking();
                    navigate(`/game/${data.game._id}`);
                }
            } catch (error) {
                console.log(error);
                clearMatchmaking();
            }
        };

        const interval = setInterval(updateRange, 3000);

        return () => clearInterval(interval);
    }, [isSearching, token, setEloRange, clearMatchmaking, navigate]);

    return null;
}