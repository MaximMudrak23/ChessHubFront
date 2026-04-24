import s from './styles.module.scss'
import BoardGrid from "./BoardGrid"
import ChessPieces from './ChessPieces'
import useChessBoard from './hooks/useChessBoard'
import type { Perspective } from './utils/chess.types'

type Props = {
    perspective?: Perspective;
}

export default function ChessBoard({perspective = 'white'}: Props) {
    const {
        pieces,
        selectedPieceID,
        selectPiece,
        movePiece,
    } = useChessBoard();
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