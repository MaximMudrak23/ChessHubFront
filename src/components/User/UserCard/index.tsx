import s from './styles.module.scss'
import UserAvatar from '../UserAvatar'
import UserName from '../UserName'
import UserElo from '../UserElo'

export default function UserCard() {
    return (
        <section className={s.userCard}>
            <UserAvatar userName='Recront' size={'64px'} frameURL='/all/steam2.png' />
            <div className={s.userInfoContainer}>
                <UserName userName='Recront' />
                <UserElo userElo={12000} style={{fontSize: '1.2rem', color: '#7C7C7C'}}/>
            </div>
        </section>
    )
}