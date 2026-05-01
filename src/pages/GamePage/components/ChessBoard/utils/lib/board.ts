import type { File, Square } from "../types/chess.types";
import type { Side } from "../../../../utils/types/game.types";

export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const boardSize = files.length;
export const cellSize = 100 / boardSize;

export function squareToCoords(square: Square) {
    const file = square[0] as File;
    const rank = Number(square[1]);

    return {
        col: files.indexOf(file) as number,
        row: boardSize - rank as number,
    };
}

export function coordsToSquare(row: number, col: number): Square {
    const file = files[col];
    const rank = boardSize - row;

    return `${file}${rank}` as Square;
}

export function squareToPosition(square: Square, perspective: Side = 'white') {
    let { row, col } = squareToCoords(square);

    if (perspective === 'black') {
        row = boardSize - 1 - row;
        col = boardSize - 1 - col;
    }

    return {
        left: col * cellSize,
        top: row * cellSize,
    };
}