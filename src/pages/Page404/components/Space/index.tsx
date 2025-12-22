import s from './styles.module.scss'
import Lootie from 'lottie-react'
import SpaceJSON from '../JSON/space.json'

export default function Space() {
    return (
        <section className={s.space}>
            <Lootie animationData={SpaceJSON} loop={true} rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
        </section>
    )
}