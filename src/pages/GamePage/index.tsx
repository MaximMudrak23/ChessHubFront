import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'

export default function GamePage() {
    return (
        <section className={s.game_page} style={{backgroundImage: `url('/game_background.webp')`}}>
            <ChessBoard perspective='white' />
        </section>
    )
}