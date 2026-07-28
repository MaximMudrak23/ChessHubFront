import s from './styles.module.scss'
import { CHESS_PIECES, SVG } from '@/constants/paths';

import type { Side } from '../../../../utils/types/game.types';
import type {
    PieceCode,
    PromotionPiece,
    Square,
} from '../../utils/types/chess.types';

import { squareToPosition } from '../../utils/lib/board';

type Props = {
    side: Side;
    square: Square;
    perspective: Side;
    pieces: readonly PromotionPiece[];
    onSelect: (piece: PromotionPiece) => void;
    onClose: () => void;
};

export default function PromotionPicker({
    side,
    square,
    perspective,
    pieces,
    onSelect,
    onClose,
}: Props) {
    const color = side === 'white' ? 'w' : 'b';

    const { left, top } = squareToPosition(square, perspective);

    const opensDown = top === 0;

    return (
        <div
            className={s.promotion_picker}
            style={{
                left: `${left}%`,
                top: opensDown ? '0' : undefined,
                bottom: opensDown ? undefined : '0',
            }}
        >
            {pieces.map(piece => {
                const pieceCode = `${color}${piece}` as PieceCode;

                return (
                    <button
                        key={piece}
                        type="button"
                        className={s.option}
                        onClick={() => onSelect(piece)}
                    >
                        <img
                            src={CHESS_PIECES.default[pieceCode]}
                            alt={pieceCode}
                            draggable={false}
                        />
                    </button>
                );
            })}

            <button
                type="button"
                className={s.close}
                onClick={onClose}
                aria-label="Close promotion menu"
            >
                <img
                    src={SVG.closeIcon}
                    alt="Close Icon"
                    draggable={false}
                />
            </button>
        </div>
    );
}