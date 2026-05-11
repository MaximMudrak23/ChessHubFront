import s from './styles.module.scss'
import UserCard from '../User/UserCard'
import OptionsContainer from './components/OptionsContainer'
import Option from './components/Option'
import BurgerIcon from './components/BurgerIcon'
import Aside from './components/Aside'
import { useEffect, useState } from 'react'
import { useHeaderOptions } from './hooks/useHeaderOptions'
import { useUserStore } from '@/store/userStore'

export default function Header() {
    const user = useUserStore(s => s.user);

    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [width,setWidth] = useState(window.innerWidth);
    const options = useHeaderOptions();
    
    useEffect(()=>{
        const onResise = function() {setWidth(window.innerWidth)};
        window.addEventListener('resize', onResise);
        if (width > 760) {setIsOpen(false)};
        return () => window.removeEventListener('resize', onResise);
    }, []);
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