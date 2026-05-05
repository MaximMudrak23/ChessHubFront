import type { PieceType } from '../types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import { getPieceSide } from './getPiece';
import { getAvailableMoves } from './getAvaibleMoves';

export function hasLegalMoves(pieces: PieceType[], side: Side) {
    const sidePieces = pieces.filter(p => getPieceSide(p) === side);

    return sidePieces.some(piece =>
        getAvailableMoves(piece, pieces).length > 0
    );
}