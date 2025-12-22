import s from './styles.module.scss'

type Props = {
    userName: string;
    frameURL: string;
}

export default function UserAvatarFrame({userName, frameURL}: Props) {
    return <img className={s.userAvatarFrame} src={frameURL} alt={`${userName} Avatar Frame`} />
}