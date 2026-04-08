import s from './styles.module.scss'
import a from './animations.module.scss'
import clsx from 'clsx';

type Variant = 'none' | 'green' | 'red' | 'black' | 'profile' | 'error' | 'welcome' | 'transparent';
type Animation = 'game' | 'main' | 'error' | 'mini-jump' | 'white-hover';
type AdaptiveMode = 'floating';

type Props = {
    text?: string;
    icon?: string;

    variant: Variant;
    animation?: Animation;
    adaptiveMode?: AdaptiveMode;
    active?: boolean;
    styleProps?: React.CSSProperties;

    onClick: () => void;
}

export default function Button(propsOBJ: Props) {
    return (
        <button
            className={clsx(
                s.button,
                s[`button--${propsOBJ.variant}`],
                propsOBJ.animation && a[`animation--${propsOBJ.animation}`],
                propsOBJ.active === false && s.inactive,
                propsOBJ.adaptiveMode === 'floating' && s.floating
            )}
            disabled={propsOBJ.active === false}
            style={propsOBJ.styleProps}
            onClick={propsOBJ.onClick}
        >
            {propsOBJ.text && <span>{propsOBJ.text}</span>}
            {propsOBJ.icon && <img src={propsOBJ.icon} alt='Button Icon' draggable={false} />}
        </button>
    )
}