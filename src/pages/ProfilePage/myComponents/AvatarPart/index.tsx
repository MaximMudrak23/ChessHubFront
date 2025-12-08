import s from './styles.module.scss'
import UserAvatar from '../../../../shared/ForFetch/UserAvatar'


export default function AvatarPart() {
    return (
        <div className={s.avatar_part}>
            <UserAvatar size='195px' username='Recront' hasFrame frameURL='/steam2.png' />
        </div>
    )
}