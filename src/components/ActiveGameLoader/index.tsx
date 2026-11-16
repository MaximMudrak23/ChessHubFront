import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getActiveGame } from '@/api/gameApi';

import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';

import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame';
import { getSocketSessionVersion } from '@/socket/socket';

export default function ActiveGameLoader() {
    const token = useUserStore(s => s.token);
    const userId = useUserStore(s => s.user?.id);
    const isGamePage = useLocation().pathname.startsWith('/game/');

    const setGame = useGameStore(s => s.setGame);
    const clearGame = useGameStore(s => s.clearGame);

    useEffect(() => {
        if (!token) {
            clearGame();
            return;
        }

        // The route loader owns the game store while a particular game is open.
        if (isGamePage) return;

        const currentToken = token;
        const session = getSocketSessionVersion();
        let active = true;

        async function loadActiveGame() {
            try {
                const data = await getActiveGame(currentToken);
                if (!active || session !== getSocketSessionVersion()) return;

                if (!data.game) {
                    clearGame();
                    return;
                }

                setGame(
                    mapServerGameToClientGame(data.game)
                );
            } catch (error) {
                if (!active || session !== getSocketSessionVersion()) return;
                console.log(error);
                clearGame();
            }
        }

        loadActiveGame();
        return () => { active = false; };
    }, [token, userId, isGamePage, setGame, clearGame]);

    return null;
}
