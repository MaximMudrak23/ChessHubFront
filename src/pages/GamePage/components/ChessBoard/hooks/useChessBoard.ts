import { useState } from "react";
import type { Side, Move } from "../../../utils/types/game.types";
import type { Square } from "../utils/types/chess.types";
import { initialPieces } from "../utils/data/initialPieces";
import { getPieceSide, getPieceById, getPieceBySquare } from "../utils/lib/getPiece";
import { canMovePiece } from "../utils/lib/canMovePiece";
import { getAvailableMoves } from "../utils/lib/getAvaibleMoves";
import { createMoveLabel } from "../utils/lib/createMoveLabel";

// useChessBoard, обязан просто управлять кликами и дергать за функции как ниточки в зависимости от того, на что мы кликнули

export default function useChessBoard(currentUserSide: Side | null, currentTurn: Side, setCurrentTurn: React.Dispatch<React.SetStateAction<Side>>, setMoves: React.Dispatch<React.SetStateAction<Move[]>>) {
    const [pieces, setPieces] = useState(initialPieces);
    const [selectedPieceID, setSelectedPieceID] = useState<string | null>(null);

    function selectPiece(pieceID: string) {
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

    function movePiece(targetSquare: Square) {
        if (!selectedPieceID) return;

        const movingPieceID = selectedPieceID;

        const selectedPiece = getPieceById(pieces, movingPieceID);
        if (!selectedPiece) return;

        if (!canMovePiece(selectedPiece, pieces, targetSquare)) return;

        const targetPiece = getPieceBySquare(pieces, targetSquare);

        const isCapture = Boolean(targetPiece);
        const moveLabel = createMoveLabel(selectedPiece, targetSquare, isCapture);

        if (targetPiece) {
            const targetSide = getPieceSide(targetPiece);

            if (targetSide === getPieceSide(selectedPiece)) return;

            setPieces(cur => cur.filter(p => p.id !== targetPiece.id).map(p => p.id === movingPieceID ? { ...p, square: targetSquare } : p));
            addMove(moveLabel);
            setSelectedPieceID(null);
            setCurrentTurn(cur => cur === 'white' ? 'black' : 'white');
            return;
        }

        setPieces(cur => cur.map(p => p.id === movingPieceID ? { ...p, square: targetSquare } : p));
        addMove(moveLabel);
        setSelectedPieceID(null);
        setCurrentTurn(cur => cur === 'white' ? 'black' : 'white');
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

    const selectedPiece = selectedPieceID ? getPieceById(pieces, selectedPieceID) : null;
    const availableMoves = selectedPiece ? getAvailableMoves(selectedPiece, pieces) : [];

    return {
        pieces,
        setPieces,
        selectedPieceID,
        selectPiece,
        movePiece,
        availableMoves,
        currentTurn,
    };
}