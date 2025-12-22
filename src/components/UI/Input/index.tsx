import s from './styles.module.scss'

type Props = {
    type?: 'text' | 'password' | 'search' | 'number' | 'email';
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function Input({type='text', placeholder, className, style}: Props) {
    const classes = [s.input, className].filter(Boolean).join(' ');
    return (
        <div className={s.inputContainer}>
            <input
                type={type}
                placeholder={placeholder}
                className={classes}
                style={style}
            />
        </div>
    )
}