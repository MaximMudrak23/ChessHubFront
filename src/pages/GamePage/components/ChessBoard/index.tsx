import s from './styles.module.scss'
import BoardGrid from './components/BoardGrid'
import ChessPieces from './components/ChessPieces'
import GameResult from './components/GameResult'
import useChessBoard from './hooks/useChessBoard'
import type { Side, Move } from '../../utils/types/game.types'
import type { Square } from './utils/types/chess.types'
import { useState, useEffect, useRef } from 'react';

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
        setMarkedSquares,
        toggleMarkedSquare,
        isCheck,
        gameStatus,
        clearSelection,
    } = useChessBoard(props.currentUserSide, props.currentTurn, props.setCurrentTurn, props.setMoves);
    
    function handleSquareClick(e: React.MouseEvent, square: Square) {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            toggleMarkedSquare(square);
            return;
        }
        
        const moved = movePiece(square);
        if (!moved) { clearSelection(); }
    }
    
    const isGameEnded = gameStatus === 'stalemate' || gameStatus === 'checkmate';
    const winnerSide = gameStatus === 'checkmate' ? props.currentTurn === 'white' ? 'black' : 'white' : null;

    const boardRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        function handleDocumentClick(e: MouseEvent) {
            if (!boardRef.current) return;

            if (!boardRef.current.contains(e.target as Node)) {
                clearSelection();
                setMarkedSquares([]);
            }
        }

        document.addEventListener('click', handleDocumentClick);
        return () => { document.removeEventListener('click', handleDocumentClick); };
    }, [clearSelection]);

    return (
        <div className={s.chess_board} ref={boardRef}>
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