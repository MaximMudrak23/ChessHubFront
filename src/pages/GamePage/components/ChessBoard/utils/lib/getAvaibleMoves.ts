import type { PieceType, Square } from '../types/chess.types';
import { boardSize, coordsToSquare } from './board';
import { canMovePiece } from './canMovePiece';
import { getPieceSide, getPieceBySquare } from './getPiece';
import { isMoveSafe } from './isMoveSafe';

export function getAvailableMoves(
    piece: PieceType,
    pieces: PieceType[],
    lastMove?: { piece: string; from: Square; to: Square } | null
) {
    const moves: { square: Square; type: 'move' | 'capture' }[] = [];
    const pieceSide = getPieceSide(piece);

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const square = coordsToSquare(row, col);

            if (!canMovePiece(piece, pieces, square, lastMove)) continue;
            if (!isMoveSafe(piece, pieces, square)) continue;
            
            const targetPiece = getPieceBySquare(pieces, square);

            if (!targetPiece) {
                const isEnPassant = piece.piece[1] === 'p' && piece.square[0] !== square[0];
                moves.push({square, type: isEnPassant ? 'capture' : 'move'});
                continue;
            }

            if (getPieceSide(targetPiece) !== pieceSide) {
                moves.push({ square, type: 'capture' });
            }
        }
    }

    return moves;
}