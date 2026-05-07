import s from './styles.module.scss'
import Option from '../Option';
import OptionsContainer from '../OptionsContainer';
import CloseIcon from '../CloseIcon';
import { SVG } from '@/constants/paths';

export default function Aside({isOpen, setIsOpen}: {isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
        <>
            <div className={`${s.aside_background} ${isOpen ? s.bc_open : ''}`} onClick={()=>setIsOpen(x => !x)} />
            
            <aside className={`${s.aside} ${isOpen ? s.open : ''}`}>
                <OptionsContainer className={s.aside_options_container}>
                    <div className={s.close_icon}><CloseIcon onClick={()=>setIsOpen(x => !x)} /></div>
                    <Option img={SVG.searchIcon} text='Search' variation='aside' />
                    <Option img={SVG.profileIcon} text='Profile' variation='aside' />
                    <Option img={SVG.menuIcon} text='Menu' variation='aside' />
                </OptionsContainer>
            </aside>
        </>
    )
}