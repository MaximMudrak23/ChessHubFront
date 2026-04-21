import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePannel from './components/SidePannel'

export default function GamePage() {
    return (
        <section className={s.game_page}>
            {/* <ChessBoard
                perspective='white'
                position={position}
                onSquareClick={handleSquareClick}
            /> */}

            <ChessBoard />
            {/* <SidePannel /> */}
        </section>
    )
}