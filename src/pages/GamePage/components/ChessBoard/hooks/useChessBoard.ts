import { useState, useEffect, useRef } from "react";
import type { Side, Move } from "../../../utils/types/game.types";
import type { Square, GameStatus, PieceType, PieceCode } from "../utils/types/chess.types";
import { getPieceSide, getPieceById, getPieceBySquare } from "../utils/lib/getPiece";
import { canMovePiece } from "../utils/lib/canMovePiece";
import { getAvailableMoves } from "../utils/lib/getAvaibleMoves";
import { createMoveLabel } from "../utils/lib/createMoveLabel";
import { isMoveSafe } from "../utils/lib/isMoveSafe";
import { isKingInCheck } from '../utils/lib/isKingInCheck';
import { hasLegalMoves } from "../utils/lib/hasLegalMoves";
import { playSound } from "../utils/lib/playSound";
import { piecesToFen } from '../utils/lib/piecesToFen';
import { getBotMove } from '@/api/gameApi';
import { applyStockfishMove } from '../utils/lib/applyStockfishMove';
import { hasInsufficientMaterial } from "../utils/lib/hasInsufficientMaterial";

// useChessBoard, обязан просто управлять кликами и дергать за функции как ниточки в зависимости от того, на что мы кликнули

export default function useChessBoard(
    currentUserSide: Side | null,
    currentTurn: Side,
    setCurrentTurn: React.Dispatch<React.SetStateAction<Side>>,
    setMoves: React.Dispatch<React.SetStateAction<Move[]>>,
    pieces: PieceType[],
    setPieces: React.Dispatch<React.SetStateAction<PieceType[]>>,
    lastMove: {
        piece: PieceCode;
        from: Square;
        to: Square;
    } | null,
    setLastMove: React.Dispatch<
        React.SetStateAction<{
            piece: PieceCode;
            from: Square;
            to: Square;
        } | null>
    >,
    isBotTurn: boolean,
    halfmoveClock: number,
    fullmoveNumber: number,
    setHalfmoveClock: (value: number | ((cur: number) => number)) => void,
    setFullmoveNumber: (value: number | ((cur: number) => number)) => void,
    positionHistory: string[],
    setPositionHistory: (value: string[] | ((cur: string[]) => string[])) => void,
) {
    const [selectedPieceID, setSelectedPieceID] = useState<string | null>(null);
    const [markedSquares, setMarkedSquares] = useState<Square[]>([]);

    function clearSelection() {
        setSelectedPieceID(null);
    }

    function selectPiece(pieceID: string) {
        if (gameStatus !== 'playing') return;
        if (!currentUserSide) return;

        const targetPiece = getPieceById(pieces, pieceID);
        if (!targetPiece) return;

        const targetSide = getPieceSide(targetPiece);

        if (targetSide === currentUserSide) {
            if (targetSide !== currentTurn) return;
            
            setSelectedPieceID(pieceID);
            return;
        }

        movePiece(targetPiece.square);
    }

    function movePiece(targetSquare: Square, pieceID = selectedPieceID): boolean {
        if (gameStatus !== 'playing') return false;
        if (!pieceID) return false;

        const movingPieceID = pieceID;

        const selectedPiece = getPieceById(pieces, movingPieceID);
        if (!selectedPiece) return false;

        const movePieceData: PieceType = selectedPiece;
        const fromSquare = movePieceData.square;

        if (!canMovePiece(selectedPiece, pieces, targetSquare, lastMove)) {
            playSound('illegal');
            return false;
        }
        if (!isMoveSafe(selectedPiece, pieces, targetSquare)) {
            playSound('illegal');
            return false;
        }
        
        const targetPiece = getPieceBySquare(pieces, targetSquare);

        const isEnPassant = selectedPiece.piece[1] === 'p' && !targetPiece && fromSquare[0] !== targetSquare[0];
        const enPassantCapturedSquare = isEnPassant ? `${targetSquare[0]}${fromSquare[1]}` as Square : null;

        const isCapture = Boolean(targetPiece);
        const promotedPiece = getPromotedPiece(selectedPiece, targetSquare);

        const isPawnMove = selectedPiece.piece[1] === 'p';
        const isRealCapture = isCapture || isEnPassant;

        function updateMoveCounters() {
            if (isPawnMove || isRealCapture) {
                setHalfmoveClock(0);
            } else {
                setHalfmoveClock(cur => cur + 1);
            }

            if (currentTurn === 'black') {
                setFullmoveNumber(cur => cur + 1);
            }
        }

        function addPositionToHistory(nextPieces: PieceType[]) {
            const nextTurn = currentTurn === 'white' ? 'black' : 'white';

            const nextFen = piecesToFen(
                nextPieces,
                nextTurn,
                isPawnMove || isRealCapture ? 0 : halfmoveClock + 1,
                currentTurn === 'black' ? fullmoveNumber + 1 : fullmoveNumber,
                {
                    piece: movePieceData.piece,
                    from: fromSquare,
                    to: targetSquare,
                },
            );

            const key = nextFen.split(' ').slice(0, 4).join(' ');

            setPositionHistory(cur => [...cur, key]);
        }

        const isCastling = selectedPiece.piece[1] === 'k' && Math.abs(targetSquare.charCodeAt(0) - fromSquare.charCodeAt(0)) === 2;

        function getNextPieces(cur: PieceType[]) {
            return cur
                .filter(p => p.id !== targetPiece?.id)
                .filter(p => p.square !== enPassantCapturedSquare)
                .map(p => {
                    if (p.id === movingPieceID) {
                        return {
                            ...p,
                            square: targetSquare,
                            piece: (promotedPiece ?? p.piece) as PieceCode,
                            hasMoved: true,
                        };
                    }

                    if (isCastling) {
                        if (targetSquare === 'g1' && p.square === 'h1') return { ...p, square: 'f1' as Square, hasMoved: true };
                        if (targetSquare === 'g8' && p.square === 'h8') return { ...p, square: 'f8' as Square, hasMoved: true };
                        if (targetSquare === 'c1' && p.square === 'a1') return { ...p, square: 'd1' as Square, hasMoved: true };
                        if (targetSquare === 'c8' && p.square === 'a8') return { ...p, square: 'd8' as Square, hasMoved: true };
                    }

                    return p;
                });
        }

        function getMoveLabel(nextPieces: PieceType[]) {
            const nextTurn = currentTurn === 'white' ? 'black' : 'white';
            const givesCheck = isKingInCheck(nextPieces, nextTurn);
            const isMate = givesCheck && !hasLegalMoves(nextPieces, nextTurn);

            return createMoveLabel({
                piece: movePieceData,
                pieces,
                targetSquare,
                isCapture: isCapture || isEnPassant,
                isCastling,
                promotedPiece,
                isCheck: givesCheck,
                isCheckmate: isMate,
            });
        }

        if (targetPiece) {
            const targetSide = getPieceSide(targetPiece);

            if (targetSide === getPieceSide(selectedPiece)) {
                playSound('illegal');
                return false;
            }

            const nextPieces = getNextPieces(pieces);
            const moveLabel = getMoveLabel(nextPieces);

            setPieces(nextPieces);
            playSound(promotedPiece ? 'promote' : 'capture');

            setLastMove({
                piece: selectedPiece.piece,
                from: fromSquare,
                to: targetSquare,
            });
            addMove(moveLabel);
            updateMoveCounters();
            addPositionToHistory(nextPieces);
            setSelectedPieceID(null);
            setCurrentTurn(cur => cur === 'white' ? 'black' : 'white');

            return true;
        }

        const nextPieces = getNextPieces(pieces);
        const moveLabel = getMoveLabel(nextPieces);

        setPieces(nextPieces);
        playSound(isCastling ? 'castle' : promotedPiece ? 'promote' : isEnPassant ? 'capture' : 'move-self');

        setLastMove({
            piece: selectedPiece.piece,
            from: fromSquare,
            to: targetSquare,
        });
        addMove(moveLabel);
        updateMoveCounters();
        addPositionToHistory(nextPieces);
        setSelectedPieceID(null);
        setCurrentTurn(cur => cur === 'white' ? 'black' : 'white');

        return true;
    }

    function addMove(newMove: string) {
        setMoves(cur => {
            if (currentTurn === 'white') {
                return [...cur, { whiteMove: newMove }];
            }

            if (cur.length === 0) { // not sure
                return [{ whiteMove: '', blackMove: newMove }];
            }

            return cur.map((move, i) => i === cur.length - 1 ? { ...move, blackMove: newMove } : move);
        });
    }

    function toggleMarkedSquare(square: Square) {
        setMarkedSquares(cur => cur.includes(square) ? cur.filter(s => s !== square) : [...cur, square]);
    }

    function getPromotedPiece(piece: PieceType | null, targetSquare: Square): PieceCode | null {
        if (!piece) return null;
        if (piece.piece[1] !== 'p') return null;

        const side = getPieceSide(piece);

        if (side === 'white' && targetSquare[1] === '8') return 'wq';
        if (side === 'black' && targetSquare[1] === '1') return 'bq';

        return null;
    }

    const selectedPiece = selectedPieceID ? getPieceById(pieces, selectedPieceID) : null;
    const availableMoves = selectedPiece ? getAvailableMoves(selectedPiece, pieces, lastMove) : [];
    
    const isCheck = isKingInCheck(pieces, currentTurn);
    const hasMoves = hasLegalMoves(pieces, currentTurn);

    const currentFen = piecesToFen(
        pieces,
        currentTurn,
        halfmoveClock,
        fullmoveNumber,
        lastMove,
    );

    const currentPositionKey = currentFen.split(' ').slice(0, 4).join(' ');

    const currentPositionCount = positionHistory.filter(
        key => key === currentPositionKey
    ).length;

    const isInsufficientMaterial = hasInsufficientMaterial(pieces);

    const gameStatus: GameStatus =
    isInsufficientMaterial
        ? 'insufficient-material-draw'
        : currentPositionCount >= 3
            ? 'threefold-repetition-draw'
            : halfmoveClock >= 100
                ? 'fifty-move-draw'
                : isCheck && !hasMoves
                    ? 'checkmate'
                    : !isCheck && !hasMoves
                        ? 'stalemate'
                        : 'playing';

    const prevCheckRef = useRef(false);
    useEffect(() => {
        if (isCheck && !prevCheckRef.current && gameStatus === 'playing') {
            playSound('move-check');
        }

        prevCheckRef.current = isCheck;
    }, [isCheck, gameStatus]);

    const prevGameStatus = useRef<GameStatus>('playing');
    useEffect(() => {
        if (
            (gameStatus !== 'playing') &&
            prevGameStatus.current === 'playing'
        ) {
            playSound('game-end');
        }

        prevGameStatus.current = gameStatus;
    }, [gameStatus]);

    useEffect(() => {
        playSound('game-start');
    }, []);

    const hasSavedInitialPosition = useRef(false);

    useEffect(() => {
        if (hasSavedInitialPosition.current) return;

        const initialFen = piecesToFen(
            pieces,
            currentTurn,
            halfmoveClock,
            fullmoveNumber,
            lastMove,
        );

        const initialKey = initialFen.split(' ').slice(0, 4).join(' ');

        setPositionHistory([initialKey]);

        hasSavedInitialPosition.current = true;
    }, []);

    useEffect(() => {
        if (!isBotTurn) return;
        if (gameStatus !== 'playing') return;

        const timer = window.setTimeout(async () => {
            try {
                const fen = piecesToFen(
                    pieces,
                    currentTurn,
                    halfmoveClock,
                    fullmoveNumber,
                    lastMove,
                );

                const data = await getBotMove(fen, 5);

                const parsedMove = applyStockfishMove({
                    move: data.move,
                    pieces,
                });

                if (!parsedMove) return;

                movePiece(
                    parsedMove.targetSquare,
                    parsedMove.pieceID,
                );
            } catch (error) {
                console.log(error);
            }
        }, 400);

        return () => window.clearTimeout(timer);
    }, [isBotTurn, currentTurn, gameStatus]);

    return {
        pieces,
        setPieces,
        selectedPieceID,
        selectPiece,
        movePiece,
        availableMoves,
        currentTurn,
        lastMove,
        markedSquares,
        setMarkedSquares,
        toggleMarkedSquare,
        isCheck,
        gameStatus,
        clearSelection,
    };
}