import type { PieceType, Square } from '../../types/chess.types';
import { canMoveRook } from './canMoveRook';
import { canMoveBishop } from './canMoveBishop';

export function canMoveQueen(piece: PieceType, pieces: PieceType[], targetSquare: Square) {
    return (
        canMoveRook(piece, pieces, targetSquare) ||
        canMoveBishop(piece, pieces, targetSquare)
    );
}