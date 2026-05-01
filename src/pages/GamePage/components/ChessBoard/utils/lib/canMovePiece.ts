import type { PieceType, Square } from '../types/chess.types';
import { canMoveRook } from './moveRules/canMoveRook';
import { canMoveBishop } from './moveRules/canMoveBishop';
import { canMoveQueen } from './moveRules/canMoveQueen';
import { canMoveKnight } from './moveRules/canMoveKnight';
import { canMoveKing } from './moveRules/canMoveKing';
import { canMovePawn } from './moveRules/canMovePawn';

// Возвращает тру если так можно ходить и фолс если незя

export function canMovePiece(piece: PieceType, pieces: PieceType[], targetSquare: Square) {
    if (piece.square === targetSquare) return false;
    
    const pieceName = piece.piece[1];

    if (pieceName === 'p') return canMovePawn(piece, pieces, targetSquare);
    if (pieceName === 'r') return canMoveRook(piece, pieces, targetSquare);
    if (pieceName === 'n') return canMoveKnight(piece, targetSquare);
    if (pieceName === 'b') return canMoveBishop(piece, pieces, targetSquare)
    if (pieceName === 'k') return canMoveKing(piece, targetSquare);
    if (pieceName === 'q') return canMoveQueen(piece, pieces, targetSquare);;
    
    return false;
}