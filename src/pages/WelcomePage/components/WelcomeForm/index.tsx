import s from './styles.module.scss'
import LogoSide from './components/LogoSide'
import RightSide from './components/RightSide'

export default function WelcomeForm() {
    return (
        <section className={s.welcome_form}>
            <LogoSide />
            <RightSide />
        </section>
    )
}