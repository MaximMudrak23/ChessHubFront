import s from './styles.module.scss'
import BoardGrid from './components/BoardGrid'
import ChessPieces from './components/ChessPieces'
import GameResult from './components/GameResult'
import useChessBoard from './hooks/useChessBoard'
import type { Side, Move } from '../../utils/types/game.types'
import type { Square } from './utils/types/chess.types'
import {useEffect, useRef, useState } from 'react';
import type { GameStatus } from './utils/types/chess.types'

type Props = {
    perspective: Side;
    currentUserSide: Side | null;
    currentTurn: Side;
    setCurrentTurn: React.Dispatch<React.SetStateAction<Side>>;
    setMoves: React.Dispatch<React.SetStateAction<Move[]>>;
    isBotTurn: boolean;
    halfmoveClock: number;
    fullmoveNumber: number;
    setHalfmoveClock: (value: number | ((cur: number) => number)) => void;
    setFullmoveNumber: (value: number | ((cur: number) => number)) => void;
    positionHistory: string[];
    setPositionHistory: (value: string[] | ((cur: string[]) => string[])) => void;
    setGameStatus: (status: GameStatus) => void;
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
    } = useChessBoard(
        props.currentUserSide,
        props.currentTurn,
        props.setCurrentTurn,
        props.setMoves,
        props.isBotTurn,
        props.halfmoveClock,
        props.fullmoveNumber,
        props.setHalfmoveClock,
        props.setFullmoveNumber,
        props.positionHistory,
        props.setPositionHistory,
    );
    
    function handleSquareClick(e: React.MouseEvent, square: Square) {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            toggleMarkedSquare(square);
            return;
        }
        
        const moved = movePiece(square);
        if (!moved) { clearSelection(); }
    }
    
    const isGameEnded = gameStatus !== 'playing';

    useEffect(() => {
        props.setGameStatus(gameStatus);
    }, [gameStatus]);

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

    const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);
    const hoveredSquareRef = useRef<Square | null>(null);
    function handleBoardMouseMove(e: React.MouseEvent) {
        if (!boardRef.current) return;

        const rect = boardRef.current.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const size = rect.width / 8;

        const col = Math.floor(x / size);
        const row = Math.floor(y / size);

        if (col < 0 || col >= 8 || row < 0 || row >= 8) {
            hoveredSquareRef.current = null;
            setHoveredSquare(null);
            return;
        }

        const realCol = props.perspective === 'black' ? 7 - col : col;
        const realRow = props.perspective === 'black' ? 7 - row : row;

        const square = `${'abcdefgh'[realCol]}${8 - realRow}` as Square;

        hoveredSquareRef.current = square;
        setHoveredSquare(square);
    }

    function handleBoardMouseLeave() {
        hoveredSquareRef.current = null;
        setHoveredSquare(null);
    }

    return (
        <div className={s.chess_board} ref={boardRef} onMouseMove={handleBoardMouseMove} onMouseLeave={handleBoardMouseLeave}>
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
                hoveredSquare={hoveredSquare}
            />
            <ChessPieces
                pieces={pieces}
                perspective={props.perspective}
                selectPiece={selectPiece}
                onSquareClick={handleSquareClick}
                isCheck={isCheck}
                currentTurn={props.currentTurn}
                movePiece={movePiece}
                hoveredSquareRef={hoveredSquareRef}
                currentUserSide={props.currentUserSide}
            />
        </div>
    )
}