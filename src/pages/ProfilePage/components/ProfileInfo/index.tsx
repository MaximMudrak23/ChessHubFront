import s from './styles.module.scss'
import UserAvatar from '../../../../components/User/UserAvatar'
import UserName from '../../../../components/User/UserName'
import UserDescription from '../../../../components/User/UserDescription'
import ProfileOptionsContainer from './components/ProfileOptionsContainer'

type Props = {
    userElo: number;
    songIMG?: string;
    songName?: string;
}

export default function ProfileInfo({userElo, songIMG, songName}: Props) {
    return (
        <section className={s.profile_info}>
            <UserAvatar userName='Recront' size={'100%'} frameURL='/steam2.png' className={s.avatar} />
            <UserName userName='Recront' className={s.username} Icons={['/RED BULL.svg']} />
            <UserDescription text='Grandma started crying when I bring a money...' className={s.description} />
            <ProfileOptionsContainer className={s.options_container} userElo={userElo} songIMG={songIMG} songName={songName}/>
        </section>
    )
}