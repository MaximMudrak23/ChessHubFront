import s from './styles.module.scss'

type Props = {
    text?: string;
    img?: string;
    width?: string;
    height?: string;
    background?: string;
    border?: string;
    radius?: number;
    onClick: () => void;
}

export default function Button({text, img, width='auto', height='auto', background='transparent', border='3px solid black', radius=5, onClick}: Props) {
    return <button
        type='button'
        className={s.button}
        style={{
            width: width,
            height: height,
            background: background,
            border: border,
            borderRadius: `${radius}px`,
        }}
        onClick={onClick}
    >
        {img && <img src={img} alt={'Button icon'} />}
        {text && <span>{text}</span>}
    </button>
}