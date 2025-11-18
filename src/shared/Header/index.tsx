import s from './styles.module.scss'
import UserCard from '../UserCard'
import Options from '../HeaderOptions'

export default function Header() {
    return (
        <header className={s.header}>
            <UserCard pfp='/recront.jpg' username='Recront' elo={2500} />
            <Options />
        </header>
    )
}