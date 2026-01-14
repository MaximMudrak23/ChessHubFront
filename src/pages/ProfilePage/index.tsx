import s from './styles.module.scss'
import UniversalContainer from '../../components/UniversalContainer'
import ProfileInfo from './components/ProfileInfo'
import ProfileGallery from './components/ProfileGallery'
import ProfileAside from './components/ProfileAside'

export default function ProfilePage() {
    return (
        <UniversalContainer className={s.containerMain} contentClassName={s.content} srcVideo='/all/steam.webm'>
            <ProfileInfo
                userElo={12000}
                songIMG='/all/wholelotta.jpg' songName='Страгл'
            />
            <div className={s.content_overview}>
                <ProfileGallery />
                <ProfileAside />
            </div>
        </UniversalContainer>
    )
}