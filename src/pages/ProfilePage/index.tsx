import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import UserAvatar from '../../components/User/UserAvatar'
import UserName from '../../components/User/UserName'
import Button from '../../components/UI/Button'
import ProfilePlate from './components/ProfilePlate'
import ProfileSongPlate from './components/ProfileSongPlate'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom'
import { getFileURL } from '@/utils/getFileURL'
import { useEffect, useState } from 'react'
import { getPlayerById, getPlayerActiveGame } from '@/api/playerApi.ts'
import type { User } from '@/types/user.types'
import Spectate from './components/JSON/spectate.json'
import Lottie from 'lottie-react'
import { socket } from '@/socket/socket';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const myUser = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [activeGameId, setActiveGameId] = useState<string | null>(null);

    useEffect(() => {
        if (!id || !myUser || !token) return;

        if (id === myUser.id) {
            setProfileUser(myUser);
            return;
        }

        const loadUser = async () => {
            try {
                const data = await getPlayerById(token, id);
                setProfileUser(data.user);
            } catch (error) {
                console.log(error);
                setProfileUser(null);
            }
        }

        loadUser();
    }, [id, myUser, token]);

    useEffect(() => {
        if (!id || !token) return;

        const loadActiveGame = async () => {
            try {
                const data = await getPlayerActiveGame(token, id);
                setActiveGameId(data.game?._id ?? null);
            } catch (error) {
                console.log(error);
                setActiveGameId(null);
            }
        }

        loadActiveGame();
    }, [id, token]);

    useEffect(() => {
        if (!id || !token) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('player:watch', id);

        function handleActiveGameUpdate(gameId: string | null) {
            setActiveGameId(gameId);
        }

        socket.on('player:active-game:update', handleActiveGameUpdate);

        return () => {
            socket.emit('player:unwatch', id);
            socket.off('player:active-game:update', handleActiveGameUpdate);
        };
    }, [id]);

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
                    {!isMyProfile && activeGameId && (
                        <Button
                            text={'Spectate Game'}
                            variant='profile'
                            animation={['rec-text', 'white-hover']}
                            onClick={() => navigate(`/game/${activeGameId}`)}
                            effect={
                                <Lottie
                                    animationData={Spectate}
                                    loop
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            }
                        />
                    )}
                </div>
            </header>
        </SteamContentWrapper>
    )
}