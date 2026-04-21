import s from './styles.module.scss'
import { globalState } from '../../../../../../GLOBALSTATE';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const boardSize = files.length;

export default function BoardGrid() {
    const cells = [];

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const file = files[col];
            const rank = boardSize - row;
            const square = `${file}${rank}`;
            const isLight = (row + col) % 2 === 0;

            cells.push({ square, isLight, file, rank, row, col })
        }
    }

    return (
        <div
            className={s.board_grid}
            style={{
                '--board-size': boardSize,
                '--board-light-letters-color': globalState.boardTheme.lightLetters,
                '--board-dark-letters-color': globalState.boardTheme.darkLetters,
                '--board-light-square': globalState.boardTheme.lightSquare,
                '--board-dark-square': globalState.boardTheme.darkSquare,
            } as React.CSSProperties}
        >
            {cells.map(({ square, isLight, file, rank, row, col }) => (
                <div
                    key={square}
                    className={`${s.cell} ${isLight ? s.lightCell : s.darkCell}`}
                    data-square={square}
                    data-rank={rank}
                    data-file={file}
                    data-row={row}
                    data-col={col}
                    onClick={()=>console.log(square)}
                />
            ))}
        </div>
    )
}