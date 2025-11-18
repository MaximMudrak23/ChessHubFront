import s from './styles.module.scss'

type Props = {
    username?: string;
    pfp?: string;
    elo?: number;
}

export default function UserCard({username, pfp, elo}: Props) {
    return (
        <section className={s.user__card}>
            <img src={pfp} alt={`${username} Avatar`} draggable={false} />
            <div className={s.textDIV}>
                <p className={s.username}>{username}</p>
                <p className={s.elo}>({elo})</p>
            </div>
        </section>
    )
}