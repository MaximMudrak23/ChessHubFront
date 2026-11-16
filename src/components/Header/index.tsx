import s from './styles.module.scss'
import UserCard from '../User/UserCard'
import OptionsContainer from './components/OptionsContainer'
import Option from './components/Option'
import BurgerIcon from './components/BurgerIcon'
import Aside from './components/Aside'

import { useEffect, useState } from 'react'
import { useHeaderOptions } from './hooks/useHeaderOptions'
import { useUserStore } from '@/store/userStore'
import { useMatchmakingStore, type SearchStatus } from '@/store/matchmakingStore'
import { getSearchStatus } from '@/api/gameApi'
import { subscribeToSocketState } from '@/socket/subscribeToSocketState'

export default function Header() {
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    
    const isSearching = useMatchmakingStore(s => s.isSearching);
    const eloRange = useMatchmakingStore(s => s.eloRange);
    const searchStartedAt = useMatchmakingStore(s => s.searchStartedAt);

    const setSearchStatus = useMatchmakingStore(s => s.setSearchStatus);

    const [searchSeconds, setSearchSeconds] = useState(0);
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [width,setWidth] = useState(window.innerWidth);
    
    const options = useHeaderOptions();
    
    useEffect(() => {
        const onResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        if (width > 760) {
            setIsOpen(false);
        }
    }, [width]);

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

    useEffect(() => {
        if (!user?.id || !token) return;

        return subscribeToSocketState<SearchStatus>({
            event: 'matchmaking:status:update',
            loadSnapshot: () => getSearchStatus(token),
            getSnapshotVersion: () => useMatchmakingStore.getState().revision,
            canApplySnapshot: () => !useMatchmakingStore.getState().isStartingSearch,
            onUpdate: data => {
                // A connection snapshot may still say idle while POST /game/find starts.
                if (!data.searching && useMatchmakingStore.getState().isStartingSearch) return;
                setSearchStatus(data);
            },
        });
    }, [user?.id, token, setSearchStatus]);
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
