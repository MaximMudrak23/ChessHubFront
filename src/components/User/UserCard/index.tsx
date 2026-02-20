import s from './styles.module.scss'
import UserAvatar from '../UserAvatar'
import UserName from '../UserName'
import UserElo from '../UserElo'

type Props = {
    username: string;
    avatar: string;
    avatarFrame: string;
    elo: number;
}

export default function UserCard({username, avatar, avatarFrame, elo}: Props) {
    return (
        <section className={s.userCard}>
            <UserAvatar imgURL={avatar} userName={username} size={'64px'} frameURL={avatarFrame} />
            <div className={s.userInfoContainer}>
                <UserName userName={username} />
                <UserElo userElo={elo} style={{fontSize: '1.2rem', color: '#7C7C7C'}}/>
            </div>
        </section>
    )
}