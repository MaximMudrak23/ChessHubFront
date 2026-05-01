import { useState } from "react";
import type { Side } from "../../../utils/types/game.types";
import { initialPieces } from "../utils/data/initialPieces";
import type { Square } from "../utils/types/chess.types";
import { getPieceSide, getPieceById, getPieceBySquare } from "../utils/lib/getPiece";
import { canMovePiece } from "../utils/lib/canMovePiece";

// useChessBoard, обязан просто управлять кликами и дергать за функции как ниточки в зависимости от того, на что мы кликнули

export default function useChessBoard(currentUserSide: Side | null) {
    const [pieces, setPieces] = useState(initialPieces);
    const [selectedPieceID, setSelectedPieceID] = useState<string | null>(null);

    function selectPiece(pieceID: string) {
        if (!currentUserSide) return;

        const targetPiece = getPieceById(pieces, pieceID);
        if (!targetPiece) return;

        const targetSide = getPieceSide(targetPiece);

        if (targetSide === currentUserSide) {
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

        if (targetPiece) {
            const targetSide = getPieceSide(targetPiece);

            if (targetSide === currentUserSide) return;

            setPieces(cur => cur.filter(p => p.id !== targetPiece.id).map(p => p.id === movingPieceID ? { ...p, square: targetSquare } : p));

            setSelectedPieceID(null);
            return;
        }

        setPieces(cur => cur.map(p => p.id === movingPieceID ? { ...p, square: targetSquare } : p));

        setSelectedPieceID(null);
    }

    return {
        pieces,
        setPieces,
        selectedPieceID,
        selectPiece,
        movePiece,
    };
}