import { useEffect, useRef, useState } from 'react';
import type { Side } from "../../../utils/types/game.types";
import type { Square, GameStatus, PieceType, PieceCode } from "../utils/types/chess.types";
import { getPieceSide, getPieceById } from "../utils/lib/getPiece";
import { getAvailableMoves } from "../utils/lib/getAvaibleMoves";
import { playSound } from "../utils/lib/playSound";

import { makeMove } from '@/api/gameApi';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { mapServerGameToClientGame } from "@/utils/mapServerGameToClientGame";
import { isKingInCheck } from '../utils/lib/isKingInCheck';

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
        if (!token || !gameId) return false;

        const selectedPiece = getPieceById(pieces, pieceID);
        if (!selectedPiece) return false;

        isMovePendingRef.current = true;

        makeMove(token, {
            gameId,
            pieceID,
            targetSquare,
        }).then(data => {
                setGame(mapServerGameToClientGame(data.game));
            })
            .catch(error => {
                console.log(error);
                playSound('illegal');
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