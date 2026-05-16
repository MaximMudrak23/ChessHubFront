import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import UserAvatar from '../../components/User/UserAvatar'
import UserName from '../../components/User/UserName'
import Button from '../../components/UI/Button'
import ProfilePlate from './components/ProfilePlate'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'


export default function ProfilePage() {
    const user = useUserStore(s => s.user);
    const { id } = useParams();

    if (!user) return null;

    const profileBackground = user.profileBackground;
    const isMyProfile =  id === user.id;
    
    const hasSong =
        Boolean(user.profileSong?.songURL) &&
        Boolean(user.profileSong?.songName) &&
        Boolean(user.profileSong?.songAvatarURL);

    return (
        <>
            <SteamContentWrapper
                srcIMG={profileBackground?.type === 'image' && profileBackground.url
                    ? profileBackground.url
                    : undefined
                }
                srcVideo={profileBackground?.type === 'video' && profileBackground.url
                    ? profileBackground.url
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
                        {hasSong && <ProfilePlate
                            isSong
                            text={user.profileSong!.songName}
                            imgURL={user.profileSong!.songAvatarURL}
                        />}
                        {isMyProfile && <Button
                            text={'Edit Profile'}
                            active={true}
                            variant='profile'
                            animation='white-hover'
                            onClick={() => alert('Unfortunately now its not work')}
                        />}
                    </div>
                </header>
            </SteamContentWrapper>
        </>
    )
}