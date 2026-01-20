import s from './styles.module.scss'

export default function Timer() {
    return (
        <div className={s.timer_container}>
            <p className={`${s.timer} ${s.active}`}>10:00</p>
        </div>
    )
}