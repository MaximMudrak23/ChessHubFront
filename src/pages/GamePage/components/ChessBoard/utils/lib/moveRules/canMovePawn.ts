import type { PieceType, Square } from '../../types/chess.types';
import { squareToCoords, coordsToSquare } from '../board';
import { getPieceBySquare, getPieceSide } from '../getPiece';

export function canMovePawn(
    piece: PieceType,
    pieces: PieceType[],
    targetSquare: Square,
    lastMove?: { piece: string; from: Square; to: Square } | null
) {
    const from = squareToCoords(piece.square);
    const to = squareToCoords(targetSquare);

    const side = getPieceSide(piece);
    const direction = side === 'white' ? -1 : 1;
    const startRow = side === 'white' ? 6 : 1;

    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);

    const targetPiece = getPieceBySquare(pieces, targetSquare);

    if (colDiff === 0 && rowDiff === direction && !targetPiece) return true;

    if (
        colDiff === 0 &&
        from.row === startRow &&
        rowDiff === direction * 2 &&
        !targetPiece
    ) {
        const middleRow = from.row + direction;
        const middleSquare = coordsToSquare(middleRow, from.col);

        if (getPieceBySquare(pieces, middleSquare)) return false;

        return true;
    };

    if (
        colDiff === 1 &&
        rowDiff === direction &&
        targetPiece
    ) return true;

    if (
        colDiff === 1 &&
        rowDiff === direction &&
        !targetPiece &&
        lastMove?.piece[1] === 'p'
    ) {
        const lastFrom = squareToCoords(lastMove.from);
        const lastTo = squareToCoords(lastMove.to);

        const lastMoveWasDoubleStep = Math.abs(lastTo.row - lastFrom.row) === 2;
        const lastPawnIsNextToCurrentPawn = lastMove.to[0] === targetSquare[0];
        const lastPawnIsOnSameRow = lastTo.row === from.row;

        if (
            lastMoveWasDoubleStep &&
            lastPawnIsNextToCurrentPawn &&
            lastPawnIsOnSameRow
        ) {
            return true;
        }
    }

    return false;
}