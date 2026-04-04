import s from './styles.module.scss'

type Props = {
    whiteCell: string;
    blackCell: string;
}

export default function BoardShowcase({whiteCell, blackCell}: Props) {
    function getPieceForCell(index: number): {piece: string, alt: string} | null {
        if (index === 0) return {piece: '/chessPieces/bb.png', alt: 'Black Bishop'};
        if (index === 1) return {piece: '/chessPieces/bq.png', alt: 'Black Queen'};
        if (index === 2) return {piece: '/chessPieces/bp.png', alt: 'Black Pawn'};

        if (index === 6) return {piece: '/chessPieces/wn.png', alt: 'White Knight'};
        if (index === 7) return {piece: '/chessPieces/wk.png', alt: 'White King'};
        if (index === 8) return {piece: '/chessPieces/wr.png', alt: 'White Rook'};

        return null;
    }
    return (
        <div className={s.variation_showcase}>
            {
                Array.from({length: 9}).map((_, index) => {
                    const isWhite = index % 2 === 0;
                    const cellImage = isWhite ? whiteCell : blackCell;
                    const pieceSRC = getPieceForCell(index);

                    return (
                        <div
                            key={'cell_' + index}
                            className={s.cell}
                            style={{backgroundImage: `url('${cellImage}')`}}
                        >
                            {pieceSRC && <img src={pieceSRC.piece} alt={pieceSRC.alt} draggable={false} />}
                        </div>
                    )
                })
            }
        </div>
    )
}