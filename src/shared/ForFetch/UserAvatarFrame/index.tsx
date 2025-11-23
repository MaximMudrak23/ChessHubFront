import s from './styles.module.scss'

type Props = {
    username: string;
    frameURL: string;
}

export default function UserAvatarFrame({username, frameURL}: Props) {
    return <img className={s.user__avatar__frame} src={frameURL} alt={`${username} Avatar Frame`} />
}