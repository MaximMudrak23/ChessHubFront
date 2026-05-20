import type { PieceType } from '../types/chess.types';

export function hasInsufficientMaterial(pieces: PieceType[]) {
    const livePieces = pieces.map(p => p.piece);

    const nonKings = livePieces.filter(piece => piece[1] !== 'k');

    if (nonKings.length === 0) return true;

    if (nonKings.length === 1) {
        const piece = nonKings[0];

        return piece[1] === 'b' || piece[1] === 'n';
    }

    return false;
}