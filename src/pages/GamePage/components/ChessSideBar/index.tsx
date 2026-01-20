import s from './styles.module.scss'
import { useState } from 'react'
import Toggle from './components/Toggle'
import PlayersTools from './components/PlayersTools'
import ButtonsFolder from './components/ButtonsFolder'
import InputFolder from './components/InputFolder'

export default function ChessSideBar() {
    const [activeTab, setActiveTab] = useState<'moves' | 'chat'>('moves');
    return (
        <div className={s.chess_side_bar}>
            <PlayersTools /> {/* split this component and all this two timers and 2 profiles set here not in this component AND at first name then elo then all badges so FIX THIS */}
            <Toggle activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'moves' && <ButtonsFolder />}
            {activeTab === 'chat' && <InputFolder />}
            {/* buttons and input folder maybe i can combine in 1 component and add transition after toggle */}
        </div>
    )
}
