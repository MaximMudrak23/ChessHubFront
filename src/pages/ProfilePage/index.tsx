import s from './styles.module.scss'
import Header from '../../shared/Header'
import UniversalContainer from '../../shared/UniversalContainer'
import ProfileContainer from './myComponents/ProfileContainer'

export default function ProfilePage() {
    return (
        <main className={s.profile__page}>
            <Header />
            <UniversalContainer backgroundType='video' src='/steam.webm' className={s.zxczxc}>
                <ProfileContainer />
            </UniversalContainer>
        </main>
    )
}