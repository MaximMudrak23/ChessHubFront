import s from './styles.module.scss'
import OptionsContainer from '../OptionsContainer';
import { useState } from 'react';

type OptionsType = {
    optionName: string;
    optionIconURL?: string;
    title: string;
    description?: string;
    Component?: React.ElementType;
}

type Props = {
    options: OptionsType[];
}

export default function OptionsScreen({options}: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const config = options[selectedIndex];

    return (
        <div className={s.content}>
            <OptionsContainer
                options={options}
                activeIndex={selectedIndex}
                onSelect={setSelectedIndex}
            />

            <section className={s.event_screen}>
                <div className={s.title}>
                    <h1>{config.title}</h1>
                    <p className={s.description}>{config.description}</p>
                </div>

                {config.Component ? <config.Component /> : <p className={s.error}>This option is in development ⚙️</p>}
            </section>
        </div>
    )
}