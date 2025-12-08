import s from './styles.module.scss'
import UserFolder from '../UserFolder'

export default function ProfileContainer() {
    return (
        <section className={s.profileContainer}>
            <UserFolder />
        </section>
    )
}