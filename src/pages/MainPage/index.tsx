import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import Button from '../../components/UI/Button'
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom';
import { findGame, cancelSearch } from '@/api/gameApi';
import { useMatchmakingStore } from '@/store/matchmakingStore';

export default function MainPage() {
    const navigate = useNavigate();

    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    
    const gameID = useGameStore(s => s.gameId);

    const isSearching = useMatchmakingStore(s => s.isSearching);
    const setIsSearching = useMatchmakingStore(s => s.setIsSearching);
    const setEloRange = useMatchmakingStore(s => s.setEloRange);
    const setSearchStartedAt = useMatchmakingStore(s => s.setSearchStartedAt);
    const clearMatchmaking = useMatchmakingStore(s => s.clearMatchmaking);

    const buttonText = gameID ? 'Return to Game' : isSearching ? 'Cancel Search' : 'Find Game';
    const buttonColor = gameID ? 'blue' : isSearching ? 'red' : 'green';

    async function handleFindGame() {
        if (!user || !token) return;

        if (gameID) {
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

            if (data.status === 'searching') {
                setEloRange(data.eloRange);
            }
        } catch (error) {
            console.log(error);
            clearMatchmaking();
        }
    }

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