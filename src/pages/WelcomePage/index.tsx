import s from './styles.module.scss'
import WelcomeForm from './components/WelcomeForm'
import SplashScreen from './components/SplashScreen'
import { useEffect, useState } from 'react'

export default function WelcomePage() {
    const [showScreen, setShowScreen] = useState<boolean>(true);
    useEffect(()=>{
        const timerID = setTimeout(()=>setShowScreen(false), 5000);
        return () => clearTimeout(timerID);
    },[])
    return (
        <main className={s.main}>
            {showScreen && <SplashScreen />}
            <WelcomeForm />
        </main>
    )
}