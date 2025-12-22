import s from './styles.module.scss'

type Props = {
    userName: string;
    Icons?: string[];
    className?: string;
}

export default function UserName({userName, Icons, className}: Props) {
    const classArray = [s.userName, className].filter(Boolean).join(' ');
    return (
        <div className={classArray}>
            <span>{userName}</span>
            {Icons && Icons.map((x,i) => <img key={i} src={x} />)}
        </div>
    )
}