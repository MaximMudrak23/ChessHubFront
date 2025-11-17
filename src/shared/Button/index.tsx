import s from './styles.module.scss'

type Props = {
    text?: string;
    onClick?: () => void;
}

export default function Button({text, onClick}: Props) {
    return (
        <button
            className={s.button}
            onClick={onClick}
        >
            <span>{text}</span>
        </button>
    )
}