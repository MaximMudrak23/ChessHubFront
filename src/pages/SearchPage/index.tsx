import SteamContentWrapper from '../../components/SteamContentWrapper'
import Input from '../../components/UI/Input'
import FindCard from './components/FindCard'
import PageSlider from './components/PageSlider'
import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import loadingLootie from './loading.json'
import { searchUsers } from '@/api/userApi'
import { useUserStore } from '@/store/userStore'
import type { User } from '@/types/user.types'

export default function SearchPage() {
    const token = useUserStore(s => s.token);

    const [value, setValue] = useState('');
    const [cards, setCards] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [debouncedValue, setDebouncedValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
            setCurrentPage(1);
        }, 600);

        return () => clearTimeout(timer);
    }, [value]);

    useEffect(() => {
        if (!token) return;

        if (debouncedValue.trim() === '') {
            setCards([]);
            setTotalPages(0);
            return;
        }

        const loadUsers = async () => {
            try {
                setIsLoading(true);

                const data = await searchUsers(token, debouncedValue, currentPage, 10);

                setCards(data.users);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.log(error);
                setCards([]);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        }

        loadUsers();
    }, [debouncedValue, currentPage, token]);

    return (  
        <SteamContentWrapper
            styleProps={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
            }}
        >
            <Input
                id='search-input'
                value={value}
                onChangeHandler={setValue}
                variant='grey'
                placeholderText='Who you want to find?'
                styleProps={{
                    width: '85%',
                    height: '75px',
                    margin: '32px 0',
                }}
            />

            {isLoading ? (
                <Lottie
                    animationData={loadingLootie}
                    loop={true}
                    autoplay={true}
                    style={{ width: 200, height: 200 }}
                />
            ) : (
                <>
                    {cards.length > 0 ? (
                        cards.map(user => (
                            <FindCard
                                key={user.id}
                                id={user.id}
                                imgURL={user.avatarURL}
                                frameURL={user.avatarFrameURL}
                                username={user.name}
                                description={user.description}
                            />
                        ))
                    ) : (
                        debouncedValue !== '' && (
                            <div style={{
                                width: '100%',
                                height: '75px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <p style={{ fontSize: '1.4rem' }}>
                                    {`No user found with the username "${debouncedValue}". Try another one.`}
                                </p>
                            </div>
                        )
                    )}
                </>
            )}

            {!isLoading && cards.length > 0 && (
                <PageSlider
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </SteamContentWrapper>
    )
}