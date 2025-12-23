import s from './styles.module.scss'
import UserCard from '../User/UserCard'
import OptionsContainer from './components/OptionsContainer'
import Option from './components/Option'
import Aside from './components/Aside'
import { useState } from 'react'

export default function Header() {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    
    return (
        <>
            <header className={s.header}>
                <UserCard />
                
                <OptionsContainer className={s.wideScreen}>
                    <Option img='/MarketIcon.svg' text='Market' />
                    <Option img='/SearchIcon.svg' text='Search' />
                    <Option img='/ProfileIcon.svg' text='Profile' />
                    <Option img='/MenuIcon.svg' text='Menu' />
                </OptionsContainer>
                
                <OptionsContainer className={s.smallScreen}>
                    <button className={s.burger} onClick={()=>setIsOpen(x => !x)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </OptionsContainer>
            </header>
            <Aside isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}