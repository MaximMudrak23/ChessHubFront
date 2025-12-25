import s from './styles.module.scss'

export default function BurgerIcon({onClick}: {onClick: () => void}) {
    return (
        <button className={s.burger} onClick={onClick}>
            <span></span>
            <span></span>
            <span></span>
        </button>
    )
}