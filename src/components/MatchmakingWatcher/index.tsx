import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { findGame } from '@/api/gameApi';
import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';
import { useMatchmakingStore } from '@/store/matchmakingStore';
import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame';

export default function MatchmakingWatcher() {
    const navigate = useNavigate();

    const token = useUserStore(s => s.token);
    const setGame = useGameStore(s => s.setGame);

    const isSearching = useMatchmakingStore(s => s.isSearching);
    const setIsSearching = useMatchmakingStore(s => s.setIsSearching);
    const setEloRange = useMatchmakingStore(s => s.setEloRange);
    const setSearchStartedAt = useMatchmakingStore(s => s.setSearchStartedAt);
    const clearMatchmaking = useMatchmakingStore(s => s.clearMatchmaking);

    useEffect(() => {
        if (!isSearching || !token) return;

        const checkGame = async () => {
            try {
                const data = await findGame(token);

                if (data.status === 'searching') {
                    setEloRange(data.eloRange);
                    return;
                }

                if (data.status === 'matched' || data.status === 'in_game') {
                    clearMatchmaking();
                    
                    setGame(mapServerGameToClientGame(data.game));
                    navigate(`/game/${data.game._id}`);
                }
            } catch (error) {
                console.log(error);
                clearMatchmaking();
            }
        };

        const interval = setInterval(checkGame, 3000);

        return () => clearInterval(interval);
    }, [
        isSearching,
        token,
        setGame,
        navigate,
        setIsSearching,
        setEloRange,
        setSearchStartedAt,
    ]);

    return null;
}