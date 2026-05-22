import s from './styles.module.scss'
import type { File, Square } from '../../utils/types/chess.types';
import { boardSize, coordsToSquare } from '../../utils/lib/board';
import type { PieceType } from '../../utils/types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import clsx from 'clsx';
import { useUserStore } from '@/store/userStore';
import { BOARDS } from '@/constants/paths';

type Props = {
    perspective: Side;
    selectedPieceID: string | null;
    availableMoves: { square: Square; type: 'move' | 'capture' }[];
    lastMove: { from: Square; to: Square } | null;
    markedSquares: Square[];
    pieces: PieceType[];
    onSquareClick: (e: React.MouseEvent, square: Square) => void;
    hoveredSquare: Square | null;
};

export default function BoardGrid(props: Props) {
    const token = useUserStore(s => s.token);
    const user = useUserStore(s => s.user);

    if (!user || !token) return;

    const cells = [];
    const selectedPiece = props.pieces.find(p => p.id === props.selectedPieceID);
    const selectedSquare = selectedPiece?.square;

    const boardTheme = BOARDS[user.boardTheme];

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const realRow = props.perspective === 'black' ? boardSize - 1 - row : row;

            const realCol = props.perspective === 'black' ? boardSize - 1 - col : col;

            const square = coordsToSquare(realRow, realCol);

            const file = square[0] as File;
            const rank = square[1];

            const isLight = (row + col) % 2 === 0;

            cells.push({ square, isLight, file, rank, row, col });
        }
    }

    return (
        <div
            className={s.board_grid}
            style={{
                '--board-size': boardSize,
                '--board-light-letters-color': boardTheme.whiteLettersColor,
                '--board-dark-letters-color': boardTheme.blackLettersColor,
                '--board-light-square': `url(${boardTheme.whiteCell})`,
                '--board-dark-square': `url(${boardTheme.blackCell})`,
            } as React.CSSProperties}
        >
            {cells.map(({ square, isLight, file, rank, row, col }) => {
                const move = props.availableMoves.find(m => m.square === square);

                return <div
                    key={square}
                    className={clsx(s.cell, isLight ? s.lightCell : s.darkCell, square === selectedSquare && s.selected, (props.lastMove?.from === square || props.lastMove?.to === square) && s.lastMove, props.markedSquares.includes(square) && s.marked, square === props.hoveredSquare && s.hovered)}
                    data-square={square}
                    data-rank={rank}
                    data-file={file}
                    data-row={row}
                    data-col={col}
                    onClick={(e) => props.onSquareClick(e, square)}
                >
                    <span
                        className={clsx(move?.type === 'move' && s.available, move?.type === 'capture' && s.capture)}
                    />
                </div>
            })}
        </div>
    )
}