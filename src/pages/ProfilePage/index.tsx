import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import ProfileInfo from './components/ProfileInfo'
import ProfileGallery from './components/ProfileGallery'
import ProfileAside from './components/ProfileAside'

export default function ProfilePage() {
    return (
        <SteamContentWrapper>
            {/* <ProfileInfo
                userElo={12000}
                songIMG='/all/wholelotta.jpg' songName='Страгл'
            />
            <div className={s.content_overview}>
                <ProfileGallery />
                <ProfileAside />
            </div> */}
        </SteamContentWrapper>
    )
}