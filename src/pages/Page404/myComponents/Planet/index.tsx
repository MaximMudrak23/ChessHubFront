import s from './styles.module.scss'
import Lootie from 'lottie-react'
import PlanetJSON from '../JSON/planet.json'

export default function Planet() {
    return (
        <section className={s.planet}>
            <Lootie animationData={PlanetJSON} loop={true} rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
        </section>
    )
}