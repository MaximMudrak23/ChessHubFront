import s from './styles.module.scss'
import UserAvatar from '../../../../../../../../components/User/UserAvatar'
import UserName from '../../../../../../../../components/User/UserName'

export default function PlayerCard() {
    return (
        <div className={s.player_card}>
            <UserAvatar userName={'Recront'} size={'75px'} />
            <div className={s.info}>
                {/* <UserName userName='Recront' Icons={['/all/RED BULL.svg']} /> */}
                {/* <UserElo userElo={1325} style={{fontSize: '1.2rem'}} /> */}
            </div>
        </div>
    )
}


// <div className={`${s.timer} ${s.active}`}>
//     <p>10:00</p>
// </div>