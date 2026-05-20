import s from './styles.module.scss'
import UserCard from '../User/UserCard'
import OptionsContainer from './components/OptionsContainer'
import Option from './components/Option'
import BurgerIcon from './components/BurgerIcon'
import Aside from './components/Aside'
import { useEffect, useState } from 'react'
import { useHeaderOptions } from './hooks/useHeaderOptions'
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'
import { useMatchmakingStore } from '@/store/matchmakingStore'
import { findGame } from '@/api/gameApi'
import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame'

export default function Header() {
    const navigate = useNavigate();

    const token = useUserStore(s => s.token);
    const setGame = useGameStore(s => s.setGame);

    const isSearching = useMatchmakingStore(s => s.isSearching);
    const setIsSearching = useMatchmakingStore(s => s.setIsSearching);
    const eloRange = useMatchmakingStore(s => s.eloRange);
    const setEloRange = useMatchmakingStore(s => s.setEloRange);

    const [searchSeconds, setSearchSeconds] = useState(0);

    const user = useUserStore(s => s.user);

    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [width,setWidth] = useState(window.innerWidth);
    const options = useHeaderOptions();
    
    useEffect(() => {
        const onResise = function() {setWidth(window.innerWidth)};
        window.addEventListener('resize', onResise);
        if (width > 760) {setIsOpen(false)};
        return () => window.removeEventListener('resize', onResise);
    }, []);

    useEffect(() => {
        if (!isSearching) {
            setSearchSeconds(0);
            return;
        }

        const timer = setInterval(() => {
            setSearchSeconds(sec => sec + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isSearching]);

    useEffect(() => {
        if (!isSearching || !token) return;

        const interval = setInterval(async () => {
            try {
                const data = await findGame(token);

                if (data.status === 'searching') {
                    setEloRange(data.eloRange);
                }

                if (data.status === 'matched' || data.status === 'in_game') {
                    setIsSearching(false);
                    setEloRange(null);
                    setSearchSeconds(0);

                    setGame(mapServerGameToClientGame(data.game));
                    navigate(`/game/${data.game._id}`);
                }
            } catch (error) {
                console.log(error);
                setIsSearching(false);
                setEloRange(null);
                setSearchSeconds(0);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [
        isSearching,
        token,
        setGame,
        navigate,
        setIsSearching,
        setEloRange,
    ]);
    return (
        <>
            <header className={s.header}>
                <UserCard
                    userName={user?.name ?? 'Guest'}
                    imgURL={user?.avatarURL}
                    frameURL={user?.avatarFrameURL}
                    userRole={user?.role ?? 'user'}
                    userIcons={user?.userIcons}
                    variation={'header'}
                />

                {isSearching && (
                    <p>
                        Searching... {searchSeconds}s {eloRange ? `±${eloRange} Elo` : ''}
                    </p>
                )}
                
                <OptionsContainer className={s.header_options_container}>
                    {options.map(o => (
                        <Option
                            key={o.text}
                            img={o.img}
                            text={o.text}
                            variation='header'
                            onClick={o.onClick}
                        />
                    ))}
                    <BurgerIcon
                        isOpen={isOpen}
                        onClick={()=>setIsOpen(x => !x)}
                    />
                </OptionsContainer>
            </header>

            <Aside
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}