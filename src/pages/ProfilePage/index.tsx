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
import { getSocketSessionVersion, socket } from '@/socket/socket';
import { isObjectId, subscribeToSocketState } from '@/socket/subscribeToSocketState';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const myUser = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);

    const session = getSocketSessionVersion();
    const [loadedProfile, setLoadedProfile] = useState<{ id: string; session: number; user: User } | null>(null);
    const [activeGame, setActiveGame] = useState<{ id: string; session: number; gameId: string | null } | null>(null);
    const profileUser = id === myUser?.id ? myUser
        : loadedProfile && loadedProfile.id === id && loadedProfile.session === session ? loadedProfile.user : null;
    const activeGameId = activeGame && activeGame.id === id && activeGame.session === session ? activeGame.gameId : null;

    useEffect(() => {
        if (!id || !myUser || !token || id === myUser.id || !isObjectId(id)) return;
        let active = true;
        const currentSession = getSocketSessionVersion();

        const loadUser = async () => {
            try {
                const data = await getPlayerById(token, id);
                if (active && currentSession === getSocketSessionVersion()) {
                    setLoadedProfile({ id, session: currentSession, user: data.user });
                }
            } catch (error) {
                if (active && currentSession === getSocketSessionVersion()) console.log(error);
            }
        }

        loadUser();
        return () => { active = false; };
    }, [id, myUser, token]);

    useEffect(() => {
        if (!id || !token || !isObjectId(id)) return;
        const currentSession = getSocketSessionVersion();

        return subscribeToSocketState<string | null>({
            event: 'player:active-game:update',
            join: () => { socket.emit('player:watch', id); },
            leave: () => { socket.emit('player:unwatch', id); },
            loadSnapshot: async () => {
                const data = await getPlayerActiveGame(token, id);
                return data.game?._id ?? null;
            },
            accepts: gameId => gameId === null || (typeof gameId === 'string' && isObjectId(gameId)),
            onUpdate: gameId => setActiveGame({ id, session: currentSession, gameId }),
        });
    }, [id, token, myUser?.id]);

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
                    {isMyProfile &&
                        <Button
                            text={'Edit Profile'}
                            active={true}
                            variant='profile'
                            animation='white-hover'
                            onClick={() => navigate(`/profile/${id}/edit`)}
                        />
                    }
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
