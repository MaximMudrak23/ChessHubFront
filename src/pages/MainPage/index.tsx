import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import Button from '../../components/UI/Button'
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom';
import type { Game } from '@/store/gameStore'

export default function MainPage() {
    const navigate = useNavigate();
    
    const user = useUserStore(s => s.user);
    const setGame = useGameStore(s => s.setGame);

    const handleFindGame = () => {
        if (!user) return;

        const game: Game = {
            gameId: crypto.randomUUID(),
            players: {
                white: {
                    type: 'human',
                    userId: user.id,
                    side: 'white',
                    userName: user.name,
                    userElo: user.elo,
                    imgURL: user.avatarURL,
                    frameURL: user.avatarFrameURL,
                    userIcons: user.userIcons,
                },
                black: {
                    type: 'bot',
                    userId: 'bot-local',
                    side: 'black',
                    userName: 'Stockfish Bot',
                    userElo: 1000,
                    userIcons: [
                        {
                            title: 'Bot',
                            iconURL: '/uploads/badges/bot-badge.png',
                        },
                    ],
                },
            },
            currentTurn: 'white',
            moves: [],
            halfmoveClock: 0,
            fullmoveNumber: 1,
            positionHistory: [],
        };

        setGame(game);
        navigate(`/game/${game.gameId}`);
    }

    return (
        <>
            <SteamContentWrapper>
                <p style={{textAlign: 'center', paddingTop: '48px', fontSize: '1.2rem'}}>Unfortunately, I haven't figured out what to put on this page yet, so it's empty for now. 😢</p>
            </SteamContentWrapper>
            <Button
                text='Find Game'
                variant='green'
                animation='main'
                className={s.floating}
                onClick={handleFindGame}
            />
        </>
    )
}