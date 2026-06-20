import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import Button from '../../components/UI/Button'
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { findGame, cancelSearch, getSearchStatus } from '@/api/gameApi';
import { useMatchmakingStore } from '@/store/matchmakingStore';

export default function MainPage() {
    const navigate = useNavigate();

    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    
    const gameID = useGameStore(s => s.gameId);
    const gameStatus = useGameStore(s => s.gameStatus);
    const activeGameID = gameStatus === 'playing' ? gameID : null;

    const isSearching = useMatchmakingStore(s => s.isSearching);
    const setIsSearching = useMatchmakingStore(s => s.setIsSearching);
    const setEloRange = useMatchmakingStore(s => s.setEloRange);
    const setSearchStartedAt = useMatchmakingStore(s => s.setSearchStartedAt);
    const clearMatchmaking = useMatchmakingStore(s => s.clearMatchmaking);

    const buttonText = activeGameID ? 'Return to Game' : isSearching ? 'Cancel Search' : 'Find Game';
    const buttonColor = activeGameID ? 'blue' : isSearching ? 'red' : 'green';

    async function handleFindGame() {
        if (!user || !token) return;

        if (activeGameID) {
            navigate(`/game/${gameID}`);
            return;
        }

        if (isSearching) {
            await cancelSearch(token);
            clearMatchmaking();
            return;
        }

        try {
            setIsSearching(true);
            setSearchStartedAt(Date.now());

            const data = await findGame(token);

            if (data.status === 'matched' || data.status === 'in_game') {
                clearMatchmaking();
                navigate(`/game/${data.game._id}`);
                return;
            }

            if (data.status === 'searching') {
                setEloRange(data.eloRange);
            }
        } catch (error) {
            console.log(error);
            clearMatchmaking();
        }
    }

    useEffect(() => {
        if (!user || !token) return;

        getSearchStatus(token)
            .then(data => {
                if (!data.searching) {
                    clearMatchmaking();
                    return;
                }

                setIsSearching(true);
                setEloRange(data.eloRange);
                setSearchStartedAt(new Date(data.searchStartedAt).getTime());
            })
            .catch(console.log);
    }, [user, token]);

    return (
        <>
            <SteamContentWrapper>
                <p style={{textAlign: 'center', paddingTop: '48px', fontSize: '1.2rem'}}>Unfortunately, I haven't figured out what to put on this page yet, so it's empty for now. 😢</p>
            </SteamContentWrapper>
            <Button
                text={buttonText}
                variant={buttonColor}
                animation='main'
                className={s.floating}
                onClick={handleFindGame}
            />
        </>
    )
}