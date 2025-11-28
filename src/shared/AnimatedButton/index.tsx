import s from './styles.module.scss'

type Props = {
    img?: string;
    text?: string;
    imgSize?: string;
    fontSize?: string;
    background?: string;
    color?: string;
    onClick: () => void;
}

export default function AnimatedButton({img, text, background='transparent', color, imgSize='1.45rem', fontSize='1.25rem', onClick}: Props) {
    return <button
        type='button'
        className={s.animated__button}
        style={{
            background: background,
        }}
        onClick={onClick}
    >
        {img && <img src={img} alt="AnimatedButton IMG" style={{width: imgSize, height: imgSize}} />}
        {text && <span style={{backgroundImage: color, fontSize: fontSize, }}>{text}</span>}
    </button>
}