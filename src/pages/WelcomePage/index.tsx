import s from './styles.module.scss'
import WelcomeForm from './components/WelcomeForm'
import SplashScreen from './components/SplashScreen'

export default function WelcomePage() {
    return (
        <main className={s.page}>
            <SplashScreen />
            <WelcomeForm />
        </main>
    )
}