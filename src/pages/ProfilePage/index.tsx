import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import UserAvatar from '../../components/User/UserAvatar'
import UserName from '../../components/User/UserName'
import Button from '../../components/UI/Button'
import ProfilePlate from './components/ProfilePlate'
import { useParams } from 'react-router-dom'

import { globalState } from '../../../GLOBALSTATE'


export default function ProfilePage() {
    const { id } = useParams();
    const isMyProfile =  id === globalState.id; 

    return (
        <>
            <SteamContentWrapper
                srcVideo={globalState.profileBackground}
                styleProps={{backgroundColor: 'rgb(27, 25, 24, 0.5)'}}
            >
                <header className={s.profile_header}>
                    <UserAvatar
                        userName={`${globalState.name} Avatar`}
                        size={200}
                        imgURL={globalState.avatarURL}
                        frameURL={globalState.avatarFrameURL}
                    />

                    <div className={s.user_info}>
                        <UserName
                            userName={globalState.name}
                            Icons={globalState.userIcons}
                            variation='profile'
                        />
                        <div className={s.description_wrapper}>
                            <p>{globalState.description}</p>
                        </div>
                    </div>

                    <div className={s.user_buttons}>
                        <ProfilePlate
                            isElo
                            text={`${globalState.elo}`}
                        />
                        <ProfilePlate
                            isSong
                            text={globalState.profileSongName}
                            imgURL={globalState.profileSongAvatar}
                        />
                        {isMyProfile && <Button
                            text={'Edit Profile'}
                            active={true}
                            variant='profile'
                            animation='white-hover'
                            onClick={() => console.log('Edit')}
                        />}
                    </div>
                </header>
            </SteamContentWrapper>
        </>
    )
}