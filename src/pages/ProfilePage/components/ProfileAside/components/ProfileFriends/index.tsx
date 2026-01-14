import s from './styles.module.scss'
import FriendCard from '../FriendCard'

export default function ProfileFriends() {
    return (
        <div className={s.profile_friends}>
            <p>Friends</p>
            <div className={s.freinds_cards}>
                <FriendCard userAvatar='/all/steamgif.gif' userName='Recront' userFrame='/all/steam2.png' userStatus='ingame' />
                <FriendCard userAvatar='/all/image.png' userName='wiv' userStatus='online' />
                <FriendCard userAvatar='/all/wholelotta.jpg' userName='Выпирает чопер' userStatus='offline' />
            </div>
        </div>
    )
}