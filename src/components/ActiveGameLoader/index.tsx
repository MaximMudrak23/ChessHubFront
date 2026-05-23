import { useEffect } from 'react';

import { getActiveGame } from '@/api/gameApi';

import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';

import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame';

export default function ActiveGameLoader() {
    const token = useUserStore(s => s.token);

    const setGame = useGameStore(s => s.setGame);
    const clearGame = useGameStore(s => s.clearGame);

    useEffect(() => {
        if (!token) {
            clearGame();
            return;
        }

        const currentToken = token;

        async function loadActiveGame() {
            try {
                const data = await getActiveGame(currentToken);

                if (!data.game) {
                    clearGame();
                    return;
                }

                setGame(
                    mapServerGameToClientGame(data.game)
                );
            } catch (error) {
                console.log(error);
                clearGame();
            }
        }

        loadActiveGame();
    }, [token, setGame, clearGame]);

    return null;
}