import s from './styles.module.scss'

export default function Aside({isOpen, setIsOpen}: {isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
        <>
            <div className={`${s.aside_background} ${isOpen ? s.bc_open : ''}`} onClick={()=>setIsOpen(x => !x)} />
            
            <aside className={`${s.aside} ${isOpen ? s.open : ''}`}>
                <button onClick={()=>setIsOpen(x => !x)}>zxc</button>
            </aside>
        </>
    )
}