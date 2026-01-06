import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import { START_POSITION, type Position, type Square } from './components/ChessBoard/model'
import { movePiece } from './components/ChessBoard/logic'
import { useState } from 'react'

export default function GamePage() {
    const [position, setPosition] = useState<Position>(START_POSITION);
    const [selected, setSelected] = useState<Square | null>(null);

    // TESTING
        const colorOf = (p: string) => p[0] as 'w' | 'b';

        function handleSquareClick(square: Square) {
            const targetPiece = position[square];

            if (!selected) {
                if (targetPiece) setSelected(square);
                return;
            }

            if (square === selected) return;

            const from = selected;
            const fromPiece = position[from];

            if (!fromPiece) {
                setSelected(null);
                return;
            }

            if (targetPiece && colorOf(targetPiece) === colorOf(fromPiece)) {
                setSelected(square);
                return;
            }

            setPosition(p => movePiece(p, from, square));
            setSelected(null);
        }
    // TESTING

    return (
        <section className={s.game_page} style={{backgroundImage: `url('/game_background.webp')`}}>
            <ChessBoard
                perspective='white'
                position={position}
                onSquareClick={handleSquareClick}
            />
        </section>
    )
}