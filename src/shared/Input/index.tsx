import s from './styles.module.scss'

type Props = {
    type?: string;
    placeholder?: string;
}

export default function Input({type='text', placeholder}: Props) {
    return (
        <input className={s.input} type={type} placeholder={placeholder} />
    )
}