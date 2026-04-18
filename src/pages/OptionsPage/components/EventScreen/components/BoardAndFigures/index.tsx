import s from './styles.module.scss'
import { useState } from 'react';
import Option from '../../../../../../components/UI/Option'
import Board from './folders/Board';
import Figures from './folders/Figures';
import Background from './folders/Background';

const FOLDERS = {
    'Board': Board,
    'Figures': Figures,
    'Background': Background,
} as const;

type FolderName = keyof typeof FOLDERS;
const NAMES = Object.keys(FOLDERS) as FolderName[];

export default function BoardAndFigures() {
    const [selected, setSelected] = useState<FolderName>('Board');
    const ActiveFolder = FOLDERS[selected];
    
    return (
        <section className={s.board_and_figures}>
            <div className={s.options_container}>
                {NAMES.map(name => (
                    <Option
                        key={name}
                        name={name}
                        lineAxis='horizontal'
                        isActive={selected === name}
                        fontSize='medium'
                        onClick={()=>setSelected(name)}
                    />
                ))}
            </div>
            
            <div className={s.selected_option_content}>
                {ActiveFolder ? <ActiveFolder /> : <p className={s.error}>This option in development ⚙️</p>}
                {/* ДОДЕЛАТЬ ВСЕ ФОЛДЕРЫ И КОМПОНЕНТЫ ИХ И ВСЕ */}
            </div>
        </section>
    )
}