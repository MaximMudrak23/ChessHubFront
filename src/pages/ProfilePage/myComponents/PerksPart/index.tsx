import s from './styles.module.scss'
import Perk from '../Perk'


export default function PerksPart() {
    return (
        <div className={s.perks_container}>
            <Perk perkType='elo' text='3600' />
            <Perk text='You wont here but i miss you' imgSrc='/recront.jpg' perkType='song' />
            <Perk text='Edit Profile' />
        </div>
    )
}