import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'

export default function GamePage() {
    return (
        <section className={s.game_page}>
            <ChessBoard />
            <SidePanel />
        </section>
    )
}