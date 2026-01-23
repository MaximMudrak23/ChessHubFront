import s from './styles.module.scss'

export default function SplashScreen() {
    return (
        <div className={s.splash_screen}>
            <div className={s.hands}>
                <img src="/all/right.png" alt="Right Hand" className={s.right_hand} draggable={false} />
                <img src="/all/left.png" alt="Right Hand" className={s.left_hand} draggable={false} />
            </div>

            <div className={s.quote_container}>
                <p className={s.quote}>“Chess is a war over the board. The object is to crush the opponent’s mind.”</p>
                <p className={s.author}>© Bobby Fischer</p>
            </div>
        </div>
    )
}