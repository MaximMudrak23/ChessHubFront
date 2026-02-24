import s from './styles.module.scss'

export default function LogoFolder() {
    return (
        <div className={s.logo_folder}>
            <img src="/all/newlogo.png" alt="ChessHub Logo" draggable={false} />
            <span>CHESSHUB</span>
        </div>
    )
}