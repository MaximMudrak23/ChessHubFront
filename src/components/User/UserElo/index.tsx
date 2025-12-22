import s from './styles.module.scss'

type Props = {
    userElo: number;
    
    className?: string;
    style?: React.CSSProperties;
}

export default function UserElo({userElo, className, style}: Props) {
    const userEloString = userElo.toLocaleString('ru-RU');
    const classArray = [s.userElo, className].filter(Boolean).join(' ');
    return <span className={classArray} style={style}>{userEloString}</span>
}