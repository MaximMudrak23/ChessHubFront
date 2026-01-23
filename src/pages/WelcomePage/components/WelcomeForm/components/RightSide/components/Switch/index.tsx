import s from './styles.module.scss'

export default function Switch() {
    return (
        <div className={s.switch}>
            <button>Sign In</button>
            <button className={s.selected}>Sign Up</button>
        </div>
    )
}