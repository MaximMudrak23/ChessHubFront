import s from './styles.module.scss'
import Registration from '../RegistrationMainContainer'

export default function MainPage() {
    return (
        <main className={s.main__page}>
            <Registration />
        </main>
    )
}