import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import Button from '../../components/UI/Button'
import { useGameStore } from '@/store/gameStore';
import { mockGame } from '@/mock/mockGame';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
    const navigate = useNavigate();
    const setGame = useGameStore(s => s.setGame);

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
                onClick={()=>{
                    setGame(mockGame);
                    navigate(`/game/${mockGame.gameId}`);
                }}
            />
        </>
    )
}