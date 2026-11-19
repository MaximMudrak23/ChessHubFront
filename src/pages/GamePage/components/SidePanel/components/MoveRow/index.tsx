import s from './styles.module.scss'
import clsx from 'clsx';

type Props = {
    moveNumber: number;
    whiteMove: string;
    blackMove?: string;
    viewedPly: number;
    canNavigate: boolean;
    onSelectPly: (ply: number) => void;
}

export default function MoveRow({moveNumber, whiteMove, blackMove, viewedPly, canNavigate, onSelectPly}: Props) {
    const whitePly = moveNumber * 2 - 1;
    const blackPly = moveNumber * 2;
    return (
        <div className={s.move_row}>
            <span className={s.moveNumber}>{moveNumber}</span>
            <button
                type="button"
                className={clsx(s.moveSquare, viewedPly === whitePly && s.selected)}
                aria-current={viewedPly === whitePly ? 'step' : undefined}
                aria-label={`${moveNumber}. White: ${whiteMove}`}
                disabled={!canNavigate}
                onClick={() => onSelectPly(whitePly)}
            >{whiteMove}</button>
            {blackMove && <button
                type="button"
                className={clsx(s.moveSquare, viewedPly === blackPly && s.selected)}
                aria-current={viewedPly === blackPly ? 'step' : undefined}
                aria-label={`${moveNumber}. Black: ${blackMove}`}
                disabled={!canNavigate}
                onClick={() => onSelectPly(blackPly)}
            >{blackMove}</button>}
        </div>
    )
}
