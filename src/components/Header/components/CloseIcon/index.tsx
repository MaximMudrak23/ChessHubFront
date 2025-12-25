import s from './styles.module.scss'

export default function CloseIcon({onClick}: {onClick: () => void}) {
    return (
        <button className={s.close} onClick={onClick}></button>
    )
}