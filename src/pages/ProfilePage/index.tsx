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
import { useEffect, useState } from 'react'
import { getUserById } from '@/api/userApi'
import type { User } from '@/types/user.types'

export default function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const myUser = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);

    const [profileUser, setProfileUser] = useState<User | null>(null);

    useEffect(() => {
        if (!id || !myUser || !token) return;

        if (id === myUser.id) {
            setProfileUser(myUser);
            return;
        }

        const loadUser = async () => {
            try {
                const data = await getUserById(token, id);
                setProfileUser(data.user);
            } catch (error) {
                console.log(error);
                setProfileUser(null);
            }
        }

        loadUser();
    }, [id, myUser, token]);

    if (!profileUser || !myUser) return null;

    const profileBackground = profileUser.profileBackground;
    const profileSong = profileUser.profileSong;
    const isMyProfile = id === myUser.id;

    return (
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
                    userName={`${profileUser.name} Avatar`}
                    size={200}
                    imgURL={profileUser.avatarURL}
                    frameURL={profileUser.avatarFrameURL}
                />

                <div className={s.user_info}>
                    <UserName
                        userName={profileUser.name}
                        Icons={profileUser.userIcons}
                        variation='profile'
                    />
                    <div className={s.description_wrapper}>
                        <p>{profileUser.description}</p>
                    </div>
                </div>

                <div className={s.user_buttons}>
                    <ProfilePlate
                        isElo
                        text={`${profileUser.elo}`}
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
    )
}