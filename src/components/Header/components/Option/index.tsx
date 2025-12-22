import s from './styles.module.scss'

type Props = {
    img: string;
    text: string;
}

export default function Option({img, text}: Props) {
    return (
       <div className={s.optionWrapper}>
            <img className={s.optionIMG} src={img} alt="Header Option" draggable={false} />
            <p className={s.option__hover__text}>{text}</p>
        </div>
    )
}