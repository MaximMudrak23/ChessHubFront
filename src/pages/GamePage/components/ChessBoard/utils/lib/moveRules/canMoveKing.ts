import type { PieceType, Square } from '../../types/chess.types';
import { squareToCoords } from '../board';

export function canMoveKing(piece: PieceType, targetSquare: Square) {
    const from = squareToCoords(piece.square);
    const to = squareToCoords(targetSquare);

    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    return rowDiff <= 1 && colDiff <= 1;
}