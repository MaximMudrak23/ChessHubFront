import s from './styles.module.scss'

type Props = {
    isOpen: boolean;
    onClick: () => void;
}

export default function BurgerIcon(props: Props) {
    return (
        <button
            className={s.burger}
            onClick={props.onClick}
            inert={!props.isOpen ? undefined : true}
        >
            <span></span>
            <span></span>
            <span></span>
        </button>
    )
}