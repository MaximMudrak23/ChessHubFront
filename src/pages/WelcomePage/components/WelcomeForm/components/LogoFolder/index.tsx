import s from './styles.module.scss'
import { LOGO } from '@/constants/paths'

export default function LogoFolder() {
    return (
        <div className={s.logo_folder}>
            <img src={LOGO.newLogo} alt="ChessHub Logo" draggable={false} />
            <span>CHESSHUB</span>
        </div>
    )
}