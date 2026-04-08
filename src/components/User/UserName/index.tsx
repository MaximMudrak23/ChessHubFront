import s from './styles.module.scss'
import clsx from 'clsx';

type Props = {
    userName: string;
    variation: 'profile' | 'card';
    Icons?: string[];
    className?: string;
}

export default function UserName({userName, variation, Icons, className}: Props) {
    return (
        <div className={clsx(s.userName, className)}>
            <span className={clsx(s[`userName--${variation}`])}>{userName}</span>
            {Icons && Icons.length > 0 && Icons.map((icon, i) => <img key={i} src={icon} />)}
        </div>
    )
}