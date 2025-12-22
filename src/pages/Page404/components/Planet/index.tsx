import Lootie from 'lottie-react'
import PlanetJSON from '../JSON/planet.json'
import { useRef, useEffect } from 'react'

export default function Planet() {
    const lottieRef = useRef<any>(null);
    useEffect(() => { lottieRef.current?.setSpeed(0.5) }, []);
    return (
        <section>
            <Lootie lottieRef={lottieRef} animationData={PlanetJSON} loop={true} rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
        </section>
    )
}