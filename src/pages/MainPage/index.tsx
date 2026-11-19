import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import Button from '../../components/UI/Button'
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cancelSearch, getSearchStatus, getActiveGame } from '@/api/gameApi';
import { useMatchmakingStore } from '@/store/matchmakingStore';
import { getSocketSessionVersion } from '@/socket/socket';
import VideoPlayer from './components/VideoPlayer';
import GameHistory from './components/GameHistory';
import { useGameHistory } from './hooks/useGameHistory';

export default function MainPage() {
    const navigate = useNavigate();
    const history = useGameHistory();
    const [activeGame, setActiveGame] = useState<{ id: string | null; session: number } | null>(null);
    const session = getSocketSessionVersion();
    const activeGameID = activeGame?.session === session ? activeGame.id : null;
    
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);

    const isSearching = useMatchmakingStore(s => s.isSearching);
    const startSearch = useMatchmakingStore(s => s.startSearch);
    const clearMatchmaking = useMatchmakingStore(s => s.clearMatchmaking);

    const buttonText = activeGameID ? 'Return to Game' : isSearching ? 'Cancel Search' : 'Find Game (Rating)';
    const buttonColor = activeGameID ? 'blue' : isSearching ? 'red' : 'green';

    async function handleFindGame() {
        if (!user || !token) return;

        if (activeGameID) {
            navigate(`/game/${activeGameID}`);
            return;
        }

        if (isSearching) {
            clearMatchmaking();
            const revision = useMatchmakingStore.getState().revision;
            try {
                await cancelSearch(token);
            } catch (error) {
                console.log(error);
                // Restore server state only if no new search/account has replaced this cancellation.
                try {
                    const status = await getSearchStatus(token);
                    if (session === getSocketSessionVersion() && revision === useMatchmakingStore.getState().revision) {
                        useMatchmakingStore.getState().setSearchStatus(status);
                    }
                } catch (statusError) {
                    console.log(statusError);
                }
            }
            return;
        }

        startSearch();
    }

    useEffect(() => {
        if (!token) return;
        let active = true;
        const currentSession = getSocketSessionVersion();

        getActiveGame(token)
            .then(data => {
                if (active && currentSession === getSocketSessionVersion()) {
                    setActiveGame({ id: data.game?._id ?? null, session: currentSession });
                }
            })
            .catch(console.log);
        return () => { active = false; };
    }, [token, user?.id]);

    return (
        <SteamContentWrapper>
            <section className={s.top_section} aria-labelledby='play-chess-title'>
                <div className={s.game_block}>
                    <div className={s.matchmaking_group}>
                        <h1 id='play-chess-title' className={s.title}>Play Chess</h1>
                        <Button
                            text={buttonText}
                            variant={buttonColor}
                            animation='game'
                            className={s.button}
                            onClick={handleFindGame}
                        />
                    </div>
                    <div className={s.lobby_group}>
                        <Button
                            text='Create Lobby'
                            variant='glass'
                            className={s.button}
                            active={false}
                            onClick={() => {}}
                        />
                        <Button
                            text='Join Lobby'
                            variant='glass'
                            className={s.button}
                            active={false}
                            onClick={() => {}}
                        />
                    </div>
                </div>
                <VideoPlayer
                    className={s.video_block}
                    videoId='3tBzm-X8tyU'
                    title='0 Elo Chess — GothamChess'
                />
            </section>
            <GameHistory
                games={history.games}
                isLoading={history.isLoading}
                error={history.error}
                hasMore={history.hasMore}
                onLoadMore={history.loadMore}
                onRetry={history.retry}
            />
        </SteamContentWrapper>
    )
}
