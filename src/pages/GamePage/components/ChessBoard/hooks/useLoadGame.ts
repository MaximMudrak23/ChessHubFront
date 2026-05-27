import { useEffect } from 'react';

import { getGameById } from '@/api/gameApi';
import { useGameStore } from '@/store/gameStore';
import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame';

export function useLoadGame(id?: string) {
    const setGame = useGameStore(s => s.setGame);

    useEffect(() => {
        if (!id) return;

        getGameById(id)
            .then(data => {
                setGame(mapServerGameToClientGame(data.game));
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, setGame]);
}