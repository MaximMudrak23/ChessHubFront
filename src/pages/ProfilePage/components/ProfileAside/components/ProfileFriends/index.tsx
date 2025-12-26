import s from './styles.module.scss'
import FriendCard from '../FriendCard'

export default function ProfileFriends() {
    return (
        <div className={s.profile_friends}>
            <p>Friends</p>
            <div className={s.freinds_cards}>
                <FriendCard userAvatar='/steamgif.gif' userName='Recront' userFrame='/steam2.png' userStatus='ingame' />
                <FriendCard userName='Snow' userStatus='online' />
                <FriendCard userAvatar='/wholelotta.jpg' userName='Выпирает чопер' userStatus='offline' />
            </div>
        </div>
    )
}