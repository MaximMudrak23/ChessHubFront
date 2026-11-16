import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { watchMatchmaking } from '@/socket/watchMatchmaking';
import { playGameStartOnce } from '@/pages/GamePage/components/ChessBoard/utils/lib/playSound';

export default function MatchmakingWatcher() {
    const navigate = useNavigate();
    const userId = useUserStore(s => s.user?.id);
    const token = useUserStore(s => s.token);

    useEffect(() => {
        if (!userId || !token) return;

        return watchMatchmaking(userId, token, (gameId, announce) => {
            if (announce) playGameStartOnce(gameId);
            navigate(`/game/${gameId}`);
        });
    }, [userId, token, navigate]);

    return null;
}
