import { useState } from 'react'
import s from './styles.module.scss'

type Variant = 'fluid-gradient';

type Props = {
    variant: Variant;
    placeholderText?: string;
    styleProps?: React.CSSProperties;
}

export default function Input({variant, placeholderText, styleProps}: Props) {
    const [value, setValue] = useState<string>('');
    return (
        <div className={s.inputBlock} style={styleProps}>
            <input
                type="text"
                className={s[`input--${variant}`]}
                placeholder={placeholderText}
                value={value}
                onChange={(e)=>setValue(e.target.value)}
            />
        </div>
    )
}