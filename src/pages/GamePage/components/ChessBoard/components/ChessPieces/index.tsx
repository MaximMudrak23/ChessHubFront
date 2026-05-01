import s from './styles.module.scss'
import type { PieceType } from '../../utils/types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import { cellSize, squareToPosition  } from '../../utils/lib/board';

type Props = {
    pieces: PieceType[];
    perspective: Side;
    selectPiece: (pieceID: string) => void;
}

export default function ChessPieces(props: Props) {
    return (
        <div className={s.chess_pieces}>
            {props.pieces.map(({ id, piece, square }) => {
                const { left, top } = squareToPosition(square, props.perspective);

                return (
                    <img
                        key={id}
                        src={`/chessPieces/${piece}.png`}
                        alt={`${piece} on ${square}`}
                        draggable={false}
                        className={s.piece}
                        onClick={() => props.selectPiece(id)}
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