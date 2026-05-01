export type Color = 'w' | 'b';

export type PieceName = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PieceCode = `${Color}${PieceName}`;

export type Square = `${File}${Rank}`;

export type PieceType = {
    id: string;
    piece: PieceCode;
    square: Square;
};