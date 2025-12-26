import s from './styles.module.scss'
import PersonaState from './components/PersonaState'
import ProfileFriends from './components/ProfileFriends'

export default function ProfileAside() {
    return (
        <section className={s.profile_aside}>
            <PersonaState personaState='ingame' gameStatus='Sicilian Defence | White | 24 move' variant='profile' />
            <ProfileFriends />
        </section>
    )
}