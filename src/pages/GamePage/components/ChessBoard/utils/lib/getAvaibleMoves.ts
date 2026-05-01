import type { PieceType, Square } from '../types/chess.types';
import { boardSize, coordsToSquare } from './board';
import { canMovePiece } from './canMovePiece';
import { getPieceSide, getPieceBySquare } from './getPiece';

// export function getAvailableMoves(piece: PieceType, pieces: PieceType[]) {
//     const moves: Square[] = [];
//     const pieceSide = getPieceSide(piece);

//     for (let row = 0; row < boardSize; row++) {
//         for (let col = 0; col < boardSize; col++) {
//             const square = coordsToSquare(row, col);

//             if (!canMovePiece(piece, pieces, square)) continue;

//             const targetPiece = getPieceBySquare(pieces, square);

//             if (targetPiece && getPieceSide(targetPiece) === pieceSide) continue;

//             moves.push(square);
//         }
//     }

//     return moves;
// }

export function getAvailableMoves(piece: PieceType, pieces: PieceType[]) {
    const moves: { square: Square; type: 'move' | 'capture' }[] = [];
    const pieceSide = getPieceSide(piece);

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const square = coordsToSquare(row, col);

            if (!canMovePiece(piece, pieces, square)) continue;

            const targetPiece = getPieceBySquare(pieces, square);

            if (!targetPiece) {
                moves.push({ square, type: 'move' });
                continue;
            }

            if (getPieceSide(targetPiece) !== pieceSide) {
                moves.push({ square, type: 'capture' });
            }
        }
    }

    return moves;
}