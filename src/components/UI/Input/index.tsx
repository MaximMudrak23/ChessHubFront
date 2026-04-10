import s from './styles.module.scss'
import a from './animations.module.scss'
import { useState } from 'react';
import clsx from 'clsx';

type Variant = 'grey';
type Animation = 'fluid-gradient';

type Props = {
    value: string;
    onChangeHandler: (value: string) => void;
    
    id: string;
    name?: string;

    variant: Variant;
    animation?: Animation;
    placeholderText?: string;
    isHidden?: boolean;

    styleProps?: React.CSSProperties;
}

export default function Input(propsOBJ: Props) {
    const [isShown, setIsShown] = useState<boolean>(true);
    return (
        <div
            className={clsx(
                s.inputContainer,
                propsOBJ.animation && a[`animation--${propsOBJ.animation}`]
            )}
            style={propsOBJ.styleProps}>
            {propsOBJ.isHidden && <div
                className={`${s.eyeIconBlock} ${isShown && s.show}`}
                onClick={() => setIsShown(x => !x)}
            >
                <img
                    src="/all/eye.svg"
                    alt="(Show | Hide) Password"
                />
            </div>}

            <input
                id={propsOBJ.id}
                name={propsOBJ.name}
                className={clsx(
                    s.input,
                    s[`input--${propsOBJ.variant}`],
                )}
                placeholder={propsOBJ.placeholderText}
                type={isShown ? 'text' : 'password'}
                value={propsOBJ.value}
                onChange={(e)=>propsOBJ.onChangeHandler(e.target.value)}
            />
        </div>
    )
}