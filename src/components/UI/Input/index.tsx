import { useState } from 'react';
import s from './styles.module.scss'

type Variant = 'fluid-gradient';

type Props = {
    value: string;
    onChangeHandler: (value: string) => void;

    variant: Variant;
    placeholderText?: string;
    isHidden?: boolean;
    styleProps?: React.CSSProperties;
}

export default function Input(propsOBJ: Props) {
    const [isShown, setIsShown] = useState<boolean>(true);
    return (
        <div className={s.inputBlock} style={propsOBJ.styleProps}>
            {propsOBJ.isHidden && <div className={`${s.eyeIconBlock} ${isShown && s.show}`} onClick={() => setIsShown(x => !x)}>
                <img src="/all/eye.svg" alt="(Show | Hide) Password" />
            </div>}
            <input
                type={isShown ? 'text' : 'password'}
                className={s[`input--${propsOBJ.variant}`]}
                placeholder={propsOBJ.placeholderText}
                value={propsOBJ.value}
                onChange={(e)=>propsOBJ.onChangeHandler(e.target.value)}
            />
        </div>
    )
}