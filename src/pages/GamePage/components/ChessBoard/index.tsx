import s from './styles.module.scss'
import BoardGrid from './components/BoardGrid'
import ChessPieces from './components/ChessPieces'
import useChessBoard from './hooks/useChessBoard'
import type { Side } from '../../utils/types/game.types'

type Props = {
    perspective: Side;
    currentUserSide: Side | null;
}

export default function ChessBoard({currentUserSide, perspective}: Props) {
    const {
        pieces,
        selectedPieceID,
        selectPiece,
        movePiece,
    } = useChessBoard(currentUserSide);
    return (
        <div className={s.chess_board}>
            <BoardGrid
                perspective={perspective}
                selectedPieceID={selectedPieceID}
                pieces={pieces}
                onSquareClick={movePiece}
            />
            <ChessPieces
                pieces={pieces}
                perspective={perspective}
                selectPiece={selectPiece}
            />
        </div>
    )
}