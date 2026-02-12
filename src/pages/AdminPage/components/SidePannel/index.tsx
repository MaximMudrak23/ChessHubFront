import s from './styles.module.scss'
import Option from './components/Option'
import { useState } from 'react'

export default function SidePannel() {
    const [selectedOption, setSelectedOption] = useState(0);
    const OPTIONS = [
        {name: 'Users'},
        {name: 'Bots (Not Ready)'},
        {name: 'Keys (Not Ready)'},
        {name: 'Logs (Not Ready)'},
    ]
    return (
        <aside className={s.side_pannel}>
            {
                OPTIONS.map((option, index) => (
                    <Option
                        name={option.name}
                        key={index}
                        isActive={selectedOption === index}
                        onClick={()=>setSelectedOption(index)}
                    />
                ))
            }
        </aside>
    )
}