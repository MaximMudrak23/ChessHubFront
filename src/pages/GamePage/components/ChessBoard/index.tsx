import s from './styles.module.scss'

const BOARD_SIZE = 8 as const;
const CHARS = ['a','b','c','d','e','f','g','h'] as const;

type Props = {perspective?: 'white' | 'black'};

export default function ChessBoard({perspective = 'white'}: Props) {
    return (
        <div
            className={s.chess_board}
            style={{'--size': BOARD_SIZE} as React.CSSProperties}
        >
            {
                Array.from({length: (BOARD_SIZE*BOARD_SIZE)}, (_, key) => {
                    const rows = Math.floor(key / BOARD_SIZE);
                    const colums = key % BOARD_SIZE;
                    const isWhite = (rows + colums) % 2 === 0;
                    const whitePerspective = perspective === 'white';

                    const fIndex = whitePerspective ? colums : (BOARD_SIZE-1)-colums;
                    const file = CHARS[fIndex];
                    const rank = whitePerspective ? (BOARD_SIZE-rows) : (rows+1);
                    const square = `${file}${rank}`;

                    const showFile = rows === BOARD_SIZE - 1;
                    const showRank = colums === 0;
                    
                    return (
                        <div
                            className={`${s.cell} ${isWhite ? s.white : s.black}`}
                            key={square}
                        >
                            {showRank && <span className={`${s.rank} ${isWhite ? s.even : ''}`}>{rank}</span>}
                            {showFile && <span className={`${s.file} ${isWhite ? s.even : ''}`}>{file}</span>}
                        </div>
                    )
                }) 
            }
        </div>
    )
}
