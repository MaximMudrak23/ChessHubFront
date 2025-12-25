import s from './styles.module.scss'
import Option from '../Option';
import OptionsContainer from '../OptionsContainer';
import CloseIcon from '../CloseIcon';

export default function Aside({isOpen, setIsOpen}: {isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
        <>
            <div className={`${s.aside_background} ${isOpen ? s.bc_open : ''}`} onClick={()=>setIsOpen(x => !x)} />
            
            <aside className={`${s.aside} ${isOpen ? s.open : ''}`}>
                <OptionsContainer className={s.aside_options_container}>
                    <div className={s.close_icon}><CloseIcon onClick={()=>setIsOpen(x => !x)} /></div>
                    <Option img='/MarketIcon.svg' text='Market' variation='aside' />
                    <Option img='/SearchIcon.svg' text='Search' variation='aside' />
                    <Option img='/ProfileIcon.svg' text='Profile' variation='aside' />
                    <Option img='/MenuIcon.svg' text='Main' variation='aside' />
                </OptionsContainer>
            </aside>
        </>
    )
}