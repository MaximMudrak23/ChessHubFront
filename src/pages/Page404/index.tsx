import s from './styles.module.scss'
import AnimationLoop from './myComponents/AnimationLoop'

export default function Page404() {
    return (
        <main className={s.page__404}>
            <AnimationLoop />
        </main>
    )
}