import s from './styles.module.scss'
import Lootie from 'lottie-react'
import animationLoop from './404AnimationLoop.json';

export default function AnimationLoop() {
    const text = "OOPSIE! SEEMS THIS PAGE IS NOT EXIST 😢";
    return (
        <section className={s.animation__loop}>
            <Lootie animationData={animationLoop} loop={true} />
            <div className={s.animation__text}>
                {Array.from(text).map((char, i) => (
                <span key={i}>{char}</span>
                ))}
            </div>
        </section>
    )
}