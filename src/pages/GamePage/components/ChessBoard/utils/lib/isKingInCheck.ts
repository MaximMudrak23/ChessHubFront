import type { PieceType } from '../types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import { getPieceSide } from './getPiece';
import { canMovePiece } from './canMovePiece';

export function isKingInCheck(pieces: PieceType[], side: Side) {
    const king = pieces.find(p => p.piece === (side === 'white' ? 'wk' : 'bk'));
    if (!king) return false;

    const enemyPieces = pieces.filter(p => getPieceSide(p) !== side);

    return enemyPieces.some(enemy =>
        canMovePiece(enemy, pieces, king.square)
    );
}