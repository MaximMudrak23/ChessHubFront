import s from './styles.module.scss'
import UserAvatarFrame from "../UserAvatarFrame"

type Props = {
    username: string;
    hasFrame: boolean;
    size: string;
    frameURL: string
}

export default function UserAvatar({username, hasFrame, size, frameURL}: Props) {
    return (
        <div className={s.user__avatar__container}>
            <img className={s.user__avatar} src="/recront.jpg" alt={`${username} Avatar`} draggable={false} style={{width: size + 'px', height: size + 'px'}} />
            {hasFrame && <UserAvatarFrame username='Recront' frameURL={frameURL} />}
        </div>
    )
}