import type { PieceCode, PieceType, PromotionPiece, Square } from '../components/ChessBoard/utils/types/chess.types';
import { canMovePiece } from '../components/ChessBoard/utils/lib/canMovePiece';
import { getPieceSide } from '../components/ChessBoard/utils/lib/getPiece';
import { isKingInCheck } from '../components/ChessBoard/utils/lib/isKingInCheck';
import { CASTLING_ROOK_RIGHTS, describePositionTransition, type BoardPosition } from './moveNavigation';

// Local analysis only. The live game and its server-side move validation are untouched.
export function applyAnalysisMove(
    position: BoardPosition,
    pieceID: string,
    targetSquare: Square,
    promotion?: PromotionPiece,
): BoardPosition | null {
    if (!/^[a-h][1-8]$/.test(targetSquare)) return null;
    const piece = position.pieces.find(piece => piece.id === pieceID);
    if (!piece || getPieceSide(piece) !== position.currentTurn) return null;
    const target = position.pieces.find(piece => piece.square === targetSquare);
    if (target && (getPieceSide(target) === position.currentTurn || target.piece[1] === 'k')) return null;

    const color = piece.piece[0];
    const isPawn = piece.piece[1] === 'p';
    const isPromotion = isPawn && targetSquare[1] === (color === 'w' ? '8' : '1');
    if (isPromotion ? !promotion : promotion !== undefined) return null;
    if (promotion && !['q', 'r', 'b', 'n'].includes(promotion)) return null;

    let lastMove = position.lastMove;
    if (position.enPassant) {
        const file = position.enPassant[0];
        lastMove = position.currentTurn === 'white'
            ? { piece: 'bp', from: `${file}7` as Square, to: `${file}5` as Square }
            : { piece: 'wp', from: `${file}2` as Square, to: `${file}4` as Square };
    }
    if (!canMovePiece(piece, position.pieces, targetSquare, lastMove)) return null;

    const enPassant = isPawn && piece.square[0] !== targetSquare[0] && !target;
    const capturedSquare = enPassant ? `${targetSquare[0]}${piece.square[1]}` as Square : targetSquare;
    if (enPassant && (targetSquare !== position.enPassant ||
        !position.pieces.some(p => p.square === capturedSquare && p.piece === (color === 'w' ? 'bp' : 'wp')))) return null;

    const castling = piece.piece[1] === 'k' && Math.abs(piece.square.charCodeAt(0) - targetSquare.charCodeAt(0)) === 2;
    let rook: PieceType | undefined;
    let rookTarget: Square | undefined;
    if (castling) {
        const kingSide = targetSquare[0] === 'g';
        const rank = color === 'w' ? '1' : '8';
        const right = color === 'w' ? (kingSide ? 'K' : 'Q') : (kingSide ? 'k' : 'q');
        if (piece.square !== `e${rank}` || !position.castlingRights.includes(right)) return null;
        rook = position.pieces.find(p => p.square === `${kingSide ? 'h' : 'a'}${rank}` && p.piece === `${color}r`);
        if (!rook) return null;
        rookTarget = `${kingSide ? 'f' : 'd'}${rank}` as Square;
    }

    const pieces = position.pieces.filter(p => p.square !== capturedSquare).map(p => {
        if (p.id === pieceID) return {
            ...p, square: targetSquare, hasMoved: true,
            piece: promotion ? `${color}${promotion}` as PieceCode : p.piece,
        };
        if (p.id === rook?.id && rookTarget) return { ...p, square: rookTarget, hasMoved: true };
        return p;
    });
    if (isKingInCheck(pieces, position.currentTurn)) return null;

    let rights = position.castlingRights;
    const removeRight = (square: Square) => {
        const right = CASTLING_ROOK_RIGHTS[square];
        if (right) rights = rights.replace(right, '');
    };
    if (piece.piece[1] === 'k') rights = rights.replace(color === 'w' ? /[KQ]/g : /[kq]/g, '');
    if (piece.piece[1] === 'r') removeRight(piece.square);
    if (target?.piece[1] === 'r') removeRight(target.square);

    return describePositionTransition(position, {
        pieces,
        currentTurn: position.currentTurn === 'white' ? 'black' : 'white',
        castlingRights: rights && rights !== '-' ? rights : '-',
        enPassant: isPawn && Math.abs(Number(piece.square[1]) - Number(targetSquare[1])) === 2
            ? `${piece.square[0]}${(Number(piece.square[1]) + Number(targetSquare[1])) / 2}` as Square : null,
        lastMove: null,
        sound: null,
    });
}

export function analysisPromotion(piece: PieceType, target: Square): PromotionPiece | undefined {
    return piece.piece[1] === 'p' && target[1] === (piece.piece[0] === 'w' ? '8' : '1') ? 'q' : undefined;
}
