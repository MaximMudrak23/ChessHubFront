import s from './styles.module.scss'

export default function SplashScreen() {
    return (
        <div className={s.splash_screen}>
            <div className={s.quote_container}>
                <p className={s.quote}>“Chess is a <span>war</span> over the board. <br /> The object is to <span>crush</span> the <span>opponent’s mind.</span>”</p>
                <p className={s.author}>© Bobby Fischer</p>
            </div>

            <div className={s.hands_container}>
                <img src="/all/right.png" alt="Right Hand" className={s.right_hand} draggable={false} />
                <img src="/all/left.png" alt="Left Hand" className={s.left_hand} draggable={false} />
            </div>
        </div>
    )
}