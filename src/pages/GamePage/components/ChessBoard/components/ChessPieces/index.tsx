import s from './styles.module.scss'
import type { PieceType, Square } from '../../utils/types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import { cellSize, squareToPosition  } from '../../utils/lib/board';
import { getPieceSide } from '../../utils/lib/getPiece';
import clsx from 'clsx';

type Props = {
    pieces: PieceType[];
    perspective: Side;
    selectPiece: (pieceID: string) => void;
    onSquareClick: (e: React.MouseEvent, square: Square) => void;
    isCheck: boolean;
    currentTurn: Side;
}

export default function ChessPieces(props: Props) {
    function handlePieceClick(e: React.MouseEvent, square: Square, id: string) {
        if (e.ctrlKey || e.metaKey) {
            props.onSquareClick(e, square);
            return;
        }
        props.selectPiece(id);
    }

    return (
        <div className={s.chess_pieces}>
            {props.pieces.map(({ id, piece, square }) => {
                const { left, top } = squareToPosition(square, props.perspective);
                const isKing = piece[1] === 'k';
                const side = getPieceSide({ id, piece, square });
                const isCheckedKing = props.isCheck && isKing && side === props.currentTurn;

                return (
                    <img
                        key={id}
                        src={`/chessPieces/${piece}.png`}
                        alt={`${piece} on ${square}`}
                        draggable={false}
                        className={clsx(s.piece, isCheckedKing && s.check)}
                        style={{
                            width: `${cellSize}%`,
                            height: `${cellSize}%`,
                            left: `${left}%`,
                            top: `${top}%`,
                        }}
                        onClick={(e) => handlePieceClick(e, square, id)}
                    />
                );
            })}
        </div>
    )
}