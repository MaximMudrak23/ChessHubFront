import s from './styles.module.scss'

type Props = {
    moveNumber: number;
    whiteMove: string;
    blackMove?: string;
}

export default function MoveRow({moveNumber, whiteMove, blackMove}: Props) {
    return (
        <div className={s.move_row}>
            <span className={s.moveNumber}>{moveNumber}</span>
            <span className={s.moveSquare}>{whiteMove}</span>
            {blackMove && <span className={s.moveSquare}>{blackMove}</span>}
        </div>
    )
}