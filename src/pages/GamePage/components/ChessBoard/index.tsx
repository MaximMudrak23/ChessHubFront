import s from './styles.module.scss'
import BoardGrid from './components/BoardGrid'
import ChessPieces from './components/ChessPieces'
import useChessBoard from './hooks/useChessBoard'
import type { Side, Move } from '../../utils/types/game.types'

type Props = {
    perspective: Side;
    currentUserSide: Side | null;
    currentTurn: Side;
    setCurrentTurn: React.Dispatch<React.SetStateAction<Side>>;
    setMoves: React.Dispatch<React.SetStateAction<Move[]>>;
}

export default function ChessBoard(props: Props) {
    const {
        pieces,
        selectedPieceID,
        selectPiece,
        movePiece,
        availableMoves,
    } = useChessBoard(props.currentUserSide, props.currentTurn, props.setCurrentTurn, props.setMoves);
    return (
        <div className={s.chess_board}>
            <BoardGrid
                perspective={props.perspective}
                selectedPieceID={selectedPieceID}
                availableMoves={availableMoves}
                pieces={pieces}
                onSquareClick={movePiece}
            />
            <ChessPieces
                pieces={pieces}
                perspective={props.perspective}
                selectPiece={selectPiece}
            />
        </div>
    )
}