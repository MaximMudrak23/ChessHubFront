import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import UserAvatar from '../../components/User/UserAvatar'
import UserName from '../../components/User/UserName'
import Button from '../../components/UI/Button'
import ProfilePlate from './components/ProfilePlate'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom'
import { getFileURL } from '@/utils/getFileURL'
import ProfileSongPlate from './components/ProfileSongPlate.tsx'

export default function ProfilePage() {
    const navigate = useNavigate();

    const user = useUserStore(s => s.user);
    const { id } = useParams();

    if (!user) return null;

    const profileBackground = user.profileBackground;
    const profileSong = user.profileSong;
    const isMyProfile =  id === user.id;

    return (
        <>
            <SteamContentWrapper
                srcIMG={
                    profileBackground?.type === 'image' && profileBackground.url
                        ? getFileURL(profileBackground.url)
                        : undefined
                }
                srcVideo={
                    profileBackground?.type === 'video' && profileBackground.url
                        ? getFileURL(profileBackground.url)
                        : undefined
                }
                styleProps={{backgroundColor: 'rgb(27, 25, 24, 0.5)'}}
            >
                <header className={s.profile_header}>
                    <UserAvatar
                        userName={`${user.name} Avatar`}
                        size={200}
                        imgURL={user.avatarURL}
                        frameURL={user.avatarFrameURL}
                    />

                    <div className={s.user_info}>
                        <UserName
                            userName={user.name}
                            Icons={user.userIcons}
                            variation='profile'
                        />
                        <div className={s.description_wrapper}>
                            <p>{user.description}</p>
                        </div>
                    </div>

                    <div className={s.user_buttons}>
                        <ProfilePlate
                            isElo
                            text={`${user.elo}`}
                        />
                        {profileSong && (
                            <ProfileSongPlate song={profileSong} />
                        )}
                        {isMyProfile && <Button
                            text={'Edit Profile'}
                            active={true}
                            variant='profile'
                            animation='white-hover'
                            onClick={() => navigate(`/profile/${id}/edit`)}
                        />}
                    </div>
                </header>
            </SteamContentWrapper>
        </>
    )
}