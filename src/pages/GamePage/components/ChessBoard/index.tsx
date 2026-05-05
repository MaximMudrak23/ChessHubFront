import s from './styles.module.scss'
import BoardGrid from './components/BoardGrid'
import ChessPieces from './components/ChessPieces'
import GameResult from './components/GameResult'
import useChessBoard from './hooks/useChessBoard'
import type { Side, Move } from '../../utils/types/game.types'
import type { Square } from './utils/types/chess.types'

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
        lastMove,
        markedSquares,
        toggleMarkedSquare,
        isCheck,
        gameStatus,
    } = useChessBoard(props.currentUserSide, props.currentTurn, props.setCurrentTurn, props.setMoves);
    
    function handleSquareClick(e: React.MouseEvent, square: Square) {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            toggleMarkedSquare(square);
            return;
        }
        movePiece(square);
    }
    
    const isGameEnded = gameStatus === 'stalemate' || gameStatus === 'checkmate';
    const winnerSide = gameStatus === 'checkmate' ? props.currentTurn === 'white' ? 'black' : 'white' : null;

    return (
        <div className={s.chess_board}>
            <GameResult
                isGameEnded={isGameEnded}
                gameStatus={gameStatus}
                winnerSide={winnerSide}
            />
            <BoardGrid
                perspective={props.perspective}
                selectedPieceID={selectedPieceID}
                availableMoves={availableMoves}
                lastMove={lastMove}
                markedSquares={markedSquares}
                pieces={pieces}
                onSquareClick={handleSquareClick}
            />
            <ChessPieces
                pieces={pieces}
                perspective={props.perspective}
                selectPiece={selectPiece}
                onSquareClick={handleSquareClick}
                isCheck={isCheck}
                currentTurn={props.currentTurn}
            />
        </div>
    )
}