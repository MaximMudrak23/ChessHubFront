import s from './styles.module.scss'
import UserCard from '../User/UserCard'
import OptionsContainer from './components/OptionsContainer'
import Option from './components/Option'
import BurgerIcon from './components/BurgerIcon'
import Aside from './components/Aside'
import { useEffect, useState } from 'react'

export default function Header() {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    
    const [width,setWidth] = useState(window.innerWidth);
    useEffect(()=>{
        const onResise = function() {setWidth(window.innerWidth)};
        window.addEventListener('resize', onResise);
        if (width > 760) {setIsOpen(false)};
        return () => window.removeEventListener('resize', onResise);
    });
    return (
        <>
            <header className={s.header}>
                <UserCard />
                
                <OptionsContainer className={s.header_options_container}>
                    <Option img='/all/MarketIcon.svg' text='Market' variation='header' />
                    <Option img='/all/SearchIcon.svg' text='Search' variation='header' />
                    <Option img='/all/ProfileIcon.svg' text='Profile' variation='header' />
                    <Option img='/all/MenuIcon.svg' text='Main' variation='header' />
                    <BurgerIcon onClick={()=>setIsOpen(x => !x)} />
                </OptionsContainer>
            </header>
            <Aside isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}