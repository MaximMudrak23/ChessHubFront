import s from './styles.module.scss'
import BoardGrid from './components/BoardGrid'
import ChessPieces from './components/ChessPieces'
import GameResult from './components/GameResult'
import PromotionPicker from './components/PromotionPicker'
import useChessBoard from './hooks/useChessBoard'
import type { Side } from '../../utils/types/game.types'
import type { PieceType, PieceCode, Square, PromotionPiece } from './utils/types/chess.types'
import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useGameResult } from '../../hooks/useGameResult';

type Props = {
    interactionKey: string;
    canInteract: boolean;
    analysisMode: boolean;
    animationPieces?: PieceType[];
    perspective: Side;
    currentUserSide: Side | null;
    currentTurn: Side;
    winnerSide: Side | null;
    pieces: PieceType[];
    lastMove: {
        piece: PieceCode;
        from: Square;
        to: Square;
    } | null;
}

export default function ChessBoard(props: Props) {
    const gameStatus = useGameStore(s => s.gameStatus);
    const result = useGameResult();
    return (
        <div className={s.chess_board}>
            <GameResult
                isOpen={result.isOpen}
                onClose={result.close}
                gameStatus={gameStatus}
                winnerSide={props.winnerSide}
                currentUserSide={props.currentUserSide}
            />
            <BoardPosition {...props} />
        </div>
    );
}

function BoardPosition(props: Props) {
    const {
        selectedPieceID,
        selectPiece,
        movePiece,
        availableMoves,
        markedSquares,
        setMarkedSquares,
        toggleMarkedSquare,
        isCheck,
        clearSelection,
        pendingPromotion,
        cancelPromotion,
        choosePromotion,
    } = useChessBoard(
        props.currentUserSide,
        props.currentTurn,
        props.pieces,
        props.lastMove,
        props.interactionKey,
        props.analysisMode,
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
    }, [clearSelection, setMarkedSquares]);

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

    const promotionPieces: readonly PromotionPiece[] = [
        'q',
        'r',
        'b',
        'n',
    ];

    return (
        <div
            data-chess-board
            className={s.board_position}
            ref={boardRef}
            onMouseMove={handleBoardMouseMove}
            onMouseLeave={handleBoardMouseLeave}
        >
            <BoardGrid
                perspective={props.perspective}
                selectedPieceID={selectedPieceID}
                availableMoves={availableMoves}
                lastMove={props.lastMove}
                markedSquares={markedSquares}
                pieces={props.pieces}
                onSquareClick={handleSquareClick}
                hoveredSquare={hoveredSquare}
            />
            <ChessPieces
                pieces={props.pieces}
                perspective={props.perspective}
                selectedPieceID={selectedPieceID}
                selectPiece={selectPiece}
                onSquareClick={handleSquareClick}
                isCheck={isCheck}
                currentTurn={props.currentTurn}
                movePiece={movePiece}
                hoveredSquareRef={hoveredSquareRef}
                currentUserSide={props.analysisMode ? props.currentTurn : props.currentUserSide}
                canInteract={props.canInteract}
                animationPieces={props.animationPieces}
                interactionKey={props.interactionKey}
            />
            {pendingPromotion && (
                <PromotionPicker
                    side={pendingPromotion.side}
                    square={pendingPromotion.targetSquare}
                    perspective={props.perspective}
                    pieces={promotionPieces}
                    onSelect={choosePromotion}
                    onClose={cancelPromotion}
                />
            )}
        </div>
    )
}
