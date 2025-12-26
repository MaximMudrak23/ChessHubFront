import s from './styles.module.scss'
import UniversalContainer from '../../components/UniversalContainer'
import ProfileInfo from './components/ProfileInfo'
import ProfileWall from './components/ProfileWall'
import ProfileAside from './components/ProfileAside'

export default function ProfilePage() {
    return (
        <UniversalContainer className={s.containerMain} contentClassName={s.content} srcVideo='/steam.webm'>
            <ProfileInfo
                userElo={12000}
                songIMG='/wholelotta.jpg' songName='Страгл'
            />
            <div className={s.content_overview}>
                {/* <ProfileWall /> */}
                <ProfileAside />
            </div>
        </UniversalContainer>
    )
}