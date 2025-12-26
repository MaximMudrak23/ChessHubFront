import s from './styles.module.scss'
import UserAvatar from '../../../../../../components/User/UserAvatar'
import UserName from '../../../../../../components/User/UserName'
import PersonaState from '../PersonaState'

type Props = {
    userAvatar?: string;
    userFrame?: string;
    userName: string;
    userStatus: 'offline' | 'online' | 'ingame';
}

export default function FriendCard({userAvatar, userFrame, userName, userStatus}: Props) {
    return (
        <div className={s.friend_card}>
            <UserAvatar imgURL={userAvatar} frameURL={userFrame} userName={userName} size='52px' />
            <div className={s.friend_info}>
                <UserName userName={userName} className={s.username} />
                <PersonaState personaState={userStatus} variant='card' />
            </div>
        </div>
    )
}