import { useState } from "react";
import { initialPieces } from "../utils/initialPieces";
import type { Square } from "../utils/chess.types";

export default function useChessBoard() {
    const [pieces, setPieces] = useState(initialPieces);
    const [selectedPieceID, setSelectedPieceID] = useState<string | null>(null);

    function selectPiece(pieceID: string) {
        setSelectedPieceID(pieceID);
    }

    function movePiece(targetSquare: Square) {
        if (!selectedPieceID) return;
        setPieces(cur => cur.map(piece => piece.id === selectedPieceID ? { ...piece, square: targetSquare } : piece));
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