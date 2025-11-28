import s from './styles.module.scss'

type Props = {
    text?: string;
    img?: string;
    imgSize?: string;
    width?: string;
    height?: string;
    background?: string;
    border?: string;
    radius?: number;
    fontSize?: string;
    isBold?: boolean;
    onClick: () => void;
}

export default function Button({text, img, imgSize='1.65rem', width='auto', height='auto', background='transparent', border='3px solid black', radius=5, fontSize='1.25rem', isBold=false, onClick}: Props) {
    return <button
        type='button'
        className={s.button}
        style={{
            width: width,
            height: height,
            background: background,
            border: border,
            borderRadius: `${radius}px`,
            fontSize: fontSize,
            fontWeight: isBold ? 'bold' : 500,
        }}
        onClick={onClick}
    >
        {img && <img src={img} style={{width: imgSize, height: imgSize}} alt={'Button icon'} />}
        {text && <span>{text}</span>}
    </button>
}