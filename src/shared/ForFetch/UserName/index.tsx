import s from './styles.module.scss'

type Props = {
    username: string;
    usernameIcons?: string[];
}

export default function UserName({username, usernameIcons}: Props) {
    return (
        <div className={s.user_name}>
            <span>{username}</span>
            {usernameIcons && usernameIcons.map((x,i) => <img key={i} src={x} />)}
        </div>
    )
}