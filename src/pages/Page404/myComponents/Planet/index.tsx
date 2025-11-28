import s from './styles.module.scss'
import Lootie from 'lottie-react'
import PlanetJSON from '../JSON/planet.json'
import { useRef, useEffect } from 'react'

// Почекать теорию лути и узнать почему лутиреф а не просто реф.

export default function Planet() {
    const lottieRef = useRef<any>(null);
    useEffect(() => { lottieRef.current?.setSpeed(0.5) }, []);
    return (
        <section className={s.planet}>
            <Lootie lottieRef={lottieRef} animationData={PlanetJSON} loop={true} rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
        </section>
    )
}