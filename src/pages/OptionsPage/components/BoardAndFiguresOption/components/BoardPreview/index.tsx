import s from './styles.module.scss'
import type { BOARDS, CHESS_PIECES } from '@/constants/paths';

type Board = (typeof BOARDS)[keyof typeof BOARDS];
type Pieces = Omit<(typeof CHESS_PIECES)[keyof typeof CHESS_PIECES], 'name'>;

type Props = {
    board: Board;
    pieces: Pieces;
}

const PREVIEW_PIECES = [
    'bb', 'bq', 'bp',
    null, null, null,
    'wn', 'wk', 'wr',
] as const satisfies readonly (keyof Pieces | null)[];

const PIECE_NAMES = {
    bb: 'Black bishop',
    bq: 'Black queen',
    bp: 'Black pawn',
    wn: 'White knight',
    wk: 'White king',
    wr: 'White rook',
};

export default function BoardPreview({board, pieces}: Props) {
    return (
        <div
            className={s.board}
            style={{backgroundImage: `url(${board.image})`}}
            role='img'
            aria-label={`${board.name} board and pieces preview`}
        >
            {PREVIEW_PIECES.map((piece, index) => (
                <div
                    key={index}
                    className={s.cell}
                >
                    {piece && <img src={pieces[piece]} alt={PIECE_NAMES[piece]} draggable={false} />}
                </div>
            ))}
        </div>
    )
}
