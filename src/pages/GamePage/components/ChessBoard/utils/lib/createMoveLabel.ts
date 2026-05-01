import type { PieceType, Square } from '../types/chess.types';

const pieceLabels = {
    p: '',
    r: 'R',
    n: 'N',
    b: 'B',
    q: 'Q',
    k: 'K',
};

export function createMoveLabel(piece: PieceType, targetSquare: Square, isCapture: boolean) {
    const pieceName = piece.piece[1] as keyof typeof pieceLabels;
    const label = pieceLabels[pieceName];

    return `${label}${isCapture ? 'x' : ''}${targetSquare}`;
}