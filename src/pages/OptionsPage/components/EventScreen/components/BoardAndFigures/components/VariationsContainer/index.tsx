import s from './styles.module.scss'
import clsx from 'clsx';
import { type BoardVariationsKey, type BoardVariationsMap } from '../../folders/Board'

// type Props = {
//     BoardVariations: BoardVariationsMap;
//     selectedVariant: BoardVariationsKey;
//     setSelectedVariant: React.Dispatch<React.SetStateAction<BoardVariationsKey>>;
// }

export default function VariationsContainer() {
    return (
        <div className={s.board_variations_container}>
            {/* {Object.entries(BoardVariations).map(([name, {view}]) => (
                <div key={name} className={s.variation_item_wrapper}>
                    <button
                        onClick={()=>setSelectedVariant(name as BoardVariationsKey)}
                        tabIndex={selectedVariant === name ? -1 : 0}
                        className={clsx(s.cell, selectedVariant === name && s.selected)}
                        style={{backgroundImage: `url("${view}")`}}
                        data-tooltip={name}
                    />
                    {selectedVariant === name && (<img src="/all/checkmark_in_circle.svg" alt="Selected" />)}
                </div>
            ))} */}
        </div>
    )
}