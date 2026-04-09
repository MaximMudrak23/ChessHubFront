import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import UserAvatar from '../../components/User/UserAvatar'
import UserName from '../../components/User/UserName'
import Button from '../../components/UI/Button'
import ProfilePlate from './components/ProfilePlate'

import { globalState } from '../../../GLOBALSTATE'

function getButtonObj(isMyProfile: boolean, isFriend: boolean) {
    if (isMyProfile) return {
        text: 'Edit Profile',
        isActive: true,
        onClick: ()=>{console.log('Edit')}
    };

    if (isFriend) return {
        text: "Delete from friendlist",
        isActive: true,
        onClick: ()=>{console.log('Delete')}
    };
    
    return {
        text: "Add Friend",
        isActive: true,
        onClick: ()=>{console.log('Add')}
    }
}

export default function ProfilePage() {
    const result = getButtonObj(false, true);

    return (
        <>
            {/* <div className={s.you_sure}>u sure u want to delete globalstate.thisguy user name from friend list?</div> */}
            <SteamContentWrapper
                srcVideo={globalState.profileBackground}
                styleProps={{backgroundColor: 'rgb(27, 25, 24, 0.5)'}}
            >
                <header className={s.profile_header}>
                    <UserAvatar
                        userName={`${globalState.name} Avatar`}
                        size='200px'
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
                        <Button
                            text={result.text}
                            active={result.isActive}
                            variant='profile'
                            animation='white-hover'
                            onClick={result.onClick}
                        />
                    </div>
                </header>
            </SteamContentWrapper>
        </>
    )
}