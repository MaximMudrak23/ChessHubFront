import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import Button from '../../components/UI/Button'
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom';
import { findGame, cancelSearch } from '@/api/gameApi';
import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame';
import { useMatchmakingStore } from '@/store/matchmakingStore';

export default function MainPage() {
    const navigate = useNavigate();

    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const setGame = useGameStore(s => s.setGame);

    const isSearching = useMatchmakingStore(s => s.isSearching);
    const setIsSearching = useMatchmakingStore(s => s.setIsSearching);
    const setEloRange = useMatchmakingStore(s => s.setEloRange);

    async function handleFindGame() {
        if (!user || !token) return;

        if (isSearching) {
            await cancelSearch(token);
            setIsSearching(false);
            setEloRange(null);
            return;
        }

        try {
            setIsSearching(true);

            const data = await findGame(token);

            if (data.status === 'searching') {
                setEloRange(data.eloRange);
            }

            if (data.status === 'matched' || data.status === 'in_game') {
                setIsSearching(false);
                setEloRange(null);
                setGame(mapServerGameToClientGame(data.game));
                navigate(`/game/${data.game._id}`);
            }
        } catch (error) {
            console.log(error);
            setIsSearching(false);
            setEloRange(null);
        }
    }

    return (
        <>
            <SteamContentWrapper>
                <p style={{textAlign: 'center', paddingTop: '48px', fontSize: '1.2rem'}}>Unfortunately, I haven't figured out what to put on this page yet, so it's empty for now. 😢</p>
            </SteamContentWrapper>
            <Button
                text={isSearching ? 'Cancel Search' : 'Find Game'}
                variant={isSearching ? 'red' : 'green'}
                animation='main'
                className={s.floating}
                onClick={handleFindGame}
            />
        </>
    )
}