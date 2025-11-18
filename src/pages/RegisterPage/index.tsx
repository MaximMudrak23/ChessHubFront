import s from './styles.module.scss'
import Registration from './myComponents/RegistrationMainContainer'

export default function RegisterPage() {
    return (
        <main className={s.register__page}>
            <Registration />
        </main>
    )
}