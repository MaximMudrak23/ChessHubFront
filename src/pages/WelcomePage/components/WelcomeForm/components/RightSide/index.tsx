import s from './styles.module.scss'
import Switch from './components/Switch'

export default function RightSide() {
    return (
        <section className={s.right_side}>
            <Switch />
        </section>
    )
}