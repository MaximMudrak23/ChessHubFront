import s from './styles.module.scss'
import UserAvatar from '../UserAvatar'
import UserName from '../UserName'

type Props = {
    username: string;
    avatar: string;
    avatarFrame: string;
    elo: number;
}

export default function UserCard({username, avatar, avatarFrame, elo}: Props) {
    return (
        <section className={s.userCard}>
            <UserAvatar
                imgURL={avatar}
                userName={username}
                size={'64px'}
                frameURL={avatarFrame}
                className={s.usercard_avatar}
            />
            <UserName
                userName={username}
                variation='card'
                className={s.usercard_name}
                Icons={['/all/RED BULL.svg']}
            />
            <p className={s.usercard_role}>Admin</p>
        </section>
    )
}