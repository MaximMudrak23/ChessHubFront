import { useRef, useState } from 'react';
import type { Side } from "../../../utils/types/game.types";
import type { Square, PieceType, PieceCode } from "../utils/types/chess.types";
import { getPieceSide, getPieceById } from "../utils/lib/getPiece";
import { getAvailableMoves } from "../utils/lib/getAvaibleMoves";
import { playSound } from "../utils/lib/playSound";

import { makeMove } from '@/api/gameApi';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { isKingInCheck } from '../utils/lib/isKingInCheck';
import { canMovePiece } from '../utils/lib/canMovePiece';
import { isMoveSafe } from '../utils/lib/isMoveSafe';

// useChessBoard, обязан просто управлять кликами и дергать за функции как ниточки в зависимости от того, на что мы кликнули

export default function useChessBoard(
    currentUserSide: Side | null,
    currentTurn: Side,
    pieces: PieceType[],
    lastMove: { piece: PieceCode; from: Square; to: Square; } | null,
) {
    const [selectedPieceID, setSelectedPieceID] = useState<string | null>(null);
    const [markedSquares, setMarkedSquares] = useState<Square[]>([]);
    const isMovePendingRef = useRef(false);

    const token = useUserStore(s => s.token);
    const gameId = useGameStore(s => s.gameId);
    const setGame = useGameStore(s => s.setGame);
    const gameStatus = useGameStore(s => s.gameStatus);

    const players = useGameStore(s => s.players);
    const moves = useGameStore(s => s.moves);
    const halfmoveClock = useGameStore(s => s.halfmoveClock);
    const fullmoveNumber = useGameStore(s => s.fullmoveNumber);
    const positionHistory = useGameStore(s => s.positionHistory);

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
        if (isMovePendingRef.current) return false;
        if (!token || !gameId || !players) return false;

        const selectedPiece = getPieceById(pieces, pieceID);
        if (!selectedPiece) return false;

        const targetPiece = pieces.find(p => p.square === targetSquare);

        if (targetPiece && getPieceSide(targetPiece) === getPieceSide(selectedPiece)) {
            playSound('illegal');
            return false;
        }

        if (!canMovePiece(selectedPiece, pieces, targetSquare, lastMove)) {
            playSound('illegal');
            return false;
        }

        if (!isMoveSafe(selectedPiece, pieces, targetSquare)) {
            playSound('illegal');
            return false;
        }

        const previousGame = {
            gameId,
            players,
            currentTurn,
            moves,
            pieces,
            lastMove,
            halfmoveClock,
            fullmoveNumber,
            positionHistory,
            gameStatus,
            moveMeta: null,
        };

        const optimisticPieces = pieces
        .filter(p => p.square !== targetSquare)
        .map(p => p.id === pieceID ? {
                ...p,
                square: targetSquare,
                hasMoved: true,
            } : p
        );

        setGame({
            ...previousGame,
            pieces: optimisticPieces,
            currentTurn: currentTurn === 'white' ? 'black' : 'white',
            lastMove: {
                piece: selectedPiece.piece,
                from: selectedPiece.square,
                to: targetSquare,
            },
            moveMeta: null,
        });

        setSelectedPieceID(null);
        isMovePendingRef.current = true;

        makeMove(token, {
            gameId,
            pieceID,
            targetSquare,
        })
            .catch(error => {
                console.log(error);
                setGame(previousGame);
            })
            .finally(() => {
                isMovePendingRef.current = false;
            });

        return true;
    }

    function toggleMarkedSquare(square: Square) {
        setMarkedSquares(cur => cur.includes(square) ? cur.filter(s => s !== square) : [...cur, square]);
    }

    const selectedPiece = selectedPieceID ? getPieceById(pieces, selectedPieceID) : null;
    const availableMoves = selectedPiece ? getAvailableMoves(selectedPiece, pieces, lastMove) : [];
    
    const isCheck = isKingInCheck(pieces, currentTurn);

    return {
        selectedPieceID,
        selectPiece,
        movePiece,
        availableMoves,
        markedSquares,
        setMarkedSquares,
        toggleMarkedSquare,
        isCheck,
        gameStatus,
        clearSelection,
    };
}