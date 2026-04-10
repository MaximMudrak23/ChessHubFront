import SteamContentWrapper from '../../components/SteamContentWrapper'
import Input from '../../components/UI/Input'
import FindCard from './components/FindCard'
import PageSlider from './components/PageSlider'
import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import loadingLootie from './loading.json'

type CardType = {
    ImgURL: string;
    username: string;
    description?: string;
    isFriend: boolean;
}

export default function SearchPage() {
    const [value, setValue] = useState<string>('');
    const [cards, setCards] = useState<CardType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [debouncedValue,setDebouncedValue] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=> {
        const timer = setTimeout(()=>{setDebouncedValue(value)},600);
        return () => clearTimeout(timer);
    }, [value]);

    useEffect(() => {
        if (debouncedValue === '') {
            setCards([]);
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            const mockData: CardType[] = [
                { ImgURL: '/all/recront.jpg', username: 'Recront', isFriend: true }
            ];
            
            if (debouncedValue.toLowerCase().includes('rec')) {
                setCards(mockData);
            } else {
                setCards([]);
            }
            
            setIsLoading(false);
        }, 5000);

    }, [debouncedValue, currentPage]);

    return (  
        <SteamContentWrapper styleProps={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
            <Input
                value={value}
                onChangeHandler={v =>setValue(v)}
                variant='search'
                placeholderText='Who you want to find?'
                styleProps={{
                    width: '85%',
                    height: '75px',
                    margin: '32px 0',
                }}
            />

        {isLoading ? (
            <Lottie animationData={loadingLootie} loop={true} autoplay={true} style={{ width: 200, height: 200 }} />
        ) : (
            <>
                {cards.length > 0 ? (
                    cards.map((c, i) => (
                        <FindCard key={c.username + i} imgURL={c.ImgURL} username={c.username} description={c.description} isFriend={c.isFriend} />
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
            <PageSlider totalPages={5} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        )}
        </SteamContentWrapper>
    )
}