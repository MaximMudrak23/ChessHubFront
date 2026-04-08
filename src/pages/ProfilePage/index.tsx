import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import UserAvatar from '../../components/User/UserAvatar'
import UserName from '../../components/User/UserName'
import Button from '../../components/UI/Button'
import ProfilePlate from './components/ProfilePlate'

import { globalState } from '../../../GLOBALSTATE'

export default function ProfilePage() {
    function getButtonObj(isMyProfile: boolean, isFriend: boolean) {
        if (isMyProfile) return {
            text: 'Edit Profile',
            isActive: true,
            onClick: ()=>{console.log('zxc1')}
        };
        if (isFriend) return {
            text: "Delete from friendlist",
            isActive: true,
            onClick: ()=>{console.log('zxc2')}
        }; else return {
            text: "Add Friend",
            isActive: true,
            onClick: ()=>{console.log('zxc3')}
        }
    }

    const result = getButtonObj(true, true);

    return (
        <SteamContentWrapper
            srcVideo={globalState.profileBackground}
            styleProps={{backgroundColor: 'rgb(27, 25, 24, 0.5)'}}
        >
            <header className={s.profile_header}>
                {/* <div className={s.light} /> */}
                <UserAvatar
                    userName='Recront'
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
            <section className={s.profile_content}>
                <div className={s.main}></div>
                <div className={s.side}></div>
            </section>
        </SteamContentWrapper>
    )
}