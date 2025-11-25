import s from './styles.module.scss'

type Props = {
    text?: string;
    img?: string;
    imgW?: string;
    imgH?: string;
    width?: string;
    height?: string;
    background?: string;
    border?: string;
    radius?: number;
    onClick: () => void;
}

export default function Button({text, img, imgW='1.65rem', imgH='1.65rem', width='auto', height='auto', background='transparent', border='3px solid black', radius=5, onClick}: Props) {
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
        {img && <img src={img} style={{width: imgW, height: imgH}} alt={'Button icon'} />}
        {text && <span>{text}</span>}
    </button>
}