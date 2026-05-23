import s from './styles.module.scss'
import UserCard from '../User/UserCard'
import OptionsContainer from './components/OptionsContainer'
import Option from './components/Option'
import BurgerIcon from './components/BurgerIcon'
import Aside from './components/Aside'

import { useEffect, useState } from 'react'
import { useHeaderOptions } from './hooks/useHeaderOptions'
import { useUserStore } from '@/store/userStore'
import { useMatchmakingStore } from '@/store/matchmakingStore'

export default function Header() {
    const user = useUserStore(s => s.user);
    
    const isSearching = useMatchmakingStore(s => s.isSearching);
    const eloRange = useMatchmakingStore(s => s.eloRange);
    const searchStartedAt = useMatchmakingStore(s => s.searchStartedAt);

    const [searchSeconds, setSearchSeconds] = useState(0);
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [width,setWidth] = useState(window.innerWidth);
    
    const options = useHeaderOptions();
    
    useEffect(() => {
        const onResize = function() {setWidth(window.innerWidth)};
        window.addEventListener('resize', onResize);
        if (width > 760) {setIsOpen(false)};
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        if (!isSearching || !searchStartedAt) {
            setSearchSeconds(0);
            return;
        }

        const updateSeconds = () => {
            setSearchSeconds(
                Math.floor((Date.now() - searchStartedAt) / 1000)
            )
        }

        updateSeconds();

        const timer = setInterval(updateSeconds, 1000);

        return () => clearInterval(timer);
    }, [isSearching, searchStartedAt]);
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
                    <p style={{
                        background: 'linear-gradient(to bottom, #9FD05E, #45753C)',
                        padding: 12,
                        borderRadius: 10,
                    }}>
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