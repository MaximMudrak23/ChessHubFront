import s from './styles.module.scss'

export default function FindCard() {
    return (
        <div className={s.find_card}>
            <img src="/all/recront.jpg" alt="" className={s.user_pfp} />
            <div className={s.name_decription}>
                <p className={s.name}>Recront</p>
                <p className={s.description}>All this money on me</p>
            </div>
            <button>ADD AS FRIEND</button>
        </div>
    )
}