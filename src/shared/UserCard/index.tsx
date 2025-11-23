import s from './styles.module.scss'
import UserAvatar from '../ForFetch/UserAvatar'

type Props = {
    username?: string;
    elo?: number;
}

export default function UserCard({username, elo}: Props) {
    return (
        <section className={s.user__card}>
            <UserAvatar username='Recront' />
            <div className={s.textDIV}>
                <p className={s.username}>{username}</p>
                <p className={s.elo}>({elo})</p>
            </div>
        </section>
    )
}