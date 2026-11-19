import type { Move, Side } from './types/game.types';
import type { PieceCode, PieceType, Square } from '../components/ChessBoard/utils/types/chess.types';
import type { SoundName } from '../components/ChessBoard/utils/lib/playSound';
import { isKingInCheck } from '../components/ChessBoard/utils/lib/isKingInCheck';

export const INITIAL_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -';
export const CASTLING_ROOK_RIGHTS: Partial<Record<Square, string>> = { a1: 'Q', h1: 'K', a8: 'q', h8: 'k' };

export type BoardPosition = {
    pieces: PieceType[];
    currentTurn: Side;
    castlingRights: string;
    enPassant: Square | null;
    lastMove: { piece: PieceCode; from: Square; to: Square } | null;
    sound: Exclude<SoundName, 'game-end'> | null;
};

export type Variation = {
    rootPly: number;
    positions: BoardPosition[];
    cursor: number;
};

type NavigationState = {
    selectedPly: number | null;
    latestPly: number;
    navigationPositions: BoardPosition[] | null;
    variation: Variation | null;
};

export type NavigationCommand = 'previous' | 'next' | 'start' | 'end';

export function getNavigationPly(state: NavigationState): number {
    return state.variation?.cursor ?? state.selectedPly ?? state.latestPly;
}

export function getLastNavigationPly(state: NavigationState): number {
    return state.variation ? state.variation.rootPly + state.variation.positions.length - 1 : state.latestPly;
}

export function getPositionAtPly(state: NavigationState, ply: number): BoardPosition | null {
    if (state.variation && ply >= state.variation.rootPly) {
        return state.variation.positions[ply - state.variation.rootPly] ?? null;
    }
    return state.navigationPositions?.[ply] ?? null;
}

export function canAnalyzePosition(state: NavigationState & { isActive: boolean; isMovePending: boolean }): boolean {
    return Boolean(state.navigationPositions && !state.isMovePending &&
        (!state.isActive || state.selectedPly !== null || state.variation));
}

// These display-only flags recover castling eligibility, not the server's piece history.
function hasMovedInPosition(piece: PieceCode, square: Square, castling: string): boolean {
    const white = piece[0] === 'w';
    if (piece[1] === 'k') {
        const rights = white ? ['K', 'Q'] : ['k', 'q'];
        return square !== (white ? 'e1' : 'e8') || !rights.some(right => castling.includes(right));
    }
    if (piece[1] === 'r') {
        const right = CASTLING_ROOK_RIGHTS[square];
        return square[1] !== (white ? '1' : '8') || !right || !castling.includes(right);
    }
    return piece[1] !== 'p' || square[1] !== (white ? '2' : '7');
}

// Historical IDs are only for rendering. Moves always use the server's live pieces.
export function parsePosition(fen: string): BoardPosition | null {
    if (typeof fen !== 'string') return null;
    const fields = fen.trim().split(/\s+/);
    if (fields.length !== 4) return null;
    const [placement, turn, castling, enPassant] = fields;
    if (!/^[wb]$/.test(turn) || !/^(?:-|K?Q?k?q?)$/.test(castling) ||
        !/^(?:-|[a-h][36])$/.test(enPassant)) return null;

    const rows = placement.split('/');
    if (rows.length !== 8) return null;
    const pieces: PieceType[] = [];
    for (const [row, cells] of rows.entries()) {
        let col = 0;
        for (const cell of cells) {
            if (/^[1-8]$/.test(cell)) col += Number(cell);
            else {
                if (!/^[prnbqkPRNBQK]$/.test(cell) || col >= 8) return null;
                const square = `${'abcdefgh'[col]}${8 - row}` as Square;
                const piece = `${cell === cell.toUpperCase() ? 'w' : 'b'}${cell.toLowerCase()}` as PieceCode;
                pieces.push({
                    id: `history-${square}`,
                    piece,
                    square,
                    hasMoved: hasMovedInPosition(piece, square, castling),
                });
                col += 1;
            }
        }
        if (col !== 8) return null;
    }
    return {
        pieces, currentTurn: turn === 'w' ? 'white' : 'black',
        castlingRights: castling, enPassant: enPassant === '-' ? null : enPassant as Square,
        lastMove: null, sound: null,
    };
}

// Compare adjacent snapshots for presentation only; no moves are replayed or validated here.
export function describePositionTransition(before: BoardPosition, after: BoardPosition): BoardPosition {
    const unchanged = (piece: PieceType, pieces: PieceType[]) => pieces.find(p =>
        p.square === piece.square && p.piece === piece.piece);
    const movingColor = before.currentTurn === 'white' ? 'w' : 'b';
    const departed = before.pieces.filter(piece => piece.piece[0] === movingColor && !unchanged(piece, after.pieces));
    const arrived = after.pieces.filter(piece => piece.piece[0] === movingColor && !unchanged(piece, before.pieces));
    const from = departed.find(piece => piece.piece[1] === 'k') ?? departed[0];
    const to = from && (arrived.find(piece => piece.piece === from.piece) ?? arrived[0]);
    const promotion = from?.piece[1] === 'p' && to?.piece !== from.piece;
    const castling = departed.length === 2 && from?.piece[1] === 'k';
    const capture = after.pieces.length < before.pieces.length;

    const pieces = after.pieces.map(piece => {
        const source = unchanged(piece, before.pieces) ?? departed.find(p => p.piece === piece.piece) ??
            (promotion && piece === to ? from : undefined);
        return { ...piece, id: source?.id ?? piece.id };
    });

    return {
        ...after,
        pieces,
        lastMove: from && to ? { piece: from.piece, from: from.square, to: to.square } : null,
        sound: isKingInCheck(pieces, after.currentTurn) ? 'move-check'
            : promotion ? 'promote'
            : castling ? 'castle'
            : capture ? 'capture' : 'move-self',
    };
}

export function countPlies(moves: Move[]): number {
    return moves.reduce((count, move) => count + (move.whiteMove ? 1 : 0) + (move.blackMove ? 1 : 0), 0);
}

export function getNavigationPositions(moves: Move[], history: string[] | null): BoardPosition[] | null {
    if (!Array.isArray(history)) return null;
    const count = countPlies(moves);
    if (history.length !== count || moves.some((move, i) =>
        !move.whiteMove || (i < moves.length - 1 && !move.blackMove))) return null;

    const positions = [parsePosition(INITIAL_POSITION)!];
    // Validate every entry before allowing any history index to be selected.
    for (let index = 0; index < count; index += 1) {
        const position = parsePosition(history[index]);
        if (!position || position.currentTurn !== (index % 2 === 0 ? 'black' : 'white')) return null;
        positions.push(describePositionTransition(positions[index], position));
    }
    return positions;
}

export function isArrowInput(target: EventTarget | null): boolean {
    return target instanceof Element && Boolean(target.closest(
        'input, textarea, select, video, audio, [contenteditable]:not([contenteditable="false"]), ' +
        '[role="textbox"], [role="slider"], [role="spinbutton"], [role="combobox"], [role="listbox"], ' +
        '[role="menu"], [role="tablist"], [role="tree"], [role="grid"]',
    ));
}
