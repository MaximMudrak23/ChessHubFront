import s from './styles.module.scss'
import { type PieceType } from '../index'

type Props = {
    pieces: PieceType[];
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const boardSize = files.length;
const cellSize = 100 / boardSize;

function squareToPosition(square: string) {
    const file = square[0];
    const rank = Number(square[1]);

    const col = files.indexOf(file);
    const row = boardSize - rank;

    return {
        left: col * cellSize,
        top: row * cellSize,
    };
}

export default function ChessPieces({ pieces }: Props) {
    return (
        <div className={s.chess_pieces}>
            {pieces.map(({ id, piece, square }) => {
                const { left, top } = squareToPosition(square);

                return (
                    <img
                        key={id}
                        src={`/chessPieces/${piece}.png`}
                        alt={`${piece} on ${square}`}
                        draggable={false}
                        className={s.piece}
                        style={{
                            width: `${cellSize}%`,
                            height: `${cellSize}%`,
                            left: `${left}%`,
                            top: `${top}%`,
                        }}
                    />
                );
            })}
        </div>
    )
}