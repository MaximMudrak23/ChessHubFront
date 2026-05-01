import type { PieceType, Square } from '../../types/chess.types';
import { squareToCoords } from '../board';
import { isPathClear } from './isPathClear';

export function canMoveRook(piece: PieceType, pieces: PieceType[], targetSquare: Square) {
    const from = squareToCoords(piece.square);
    const to = squareToCoords(targetSquare);

    if (from.row !== to.row && from.col !== to.col) return false;

    return isPathClear(piece, pieces, targetSquare);
}