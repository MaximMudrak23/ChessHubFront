import s from './styles.module.scss'
import a from './animations.module.scss'
import clsx from 'clsx';

type Variant = 'none' | 'green' | 'red' | 'black' | 'profile' | 'error' | 'welcome' | 'transparent';
type Animation = 'game' | 'main' | 'flying' | 'mini-jump' | 'white-hover'| 'hover-icon';
type AdaptiveMode = 'floating';

type Props = {
    text?: string;
    icon?: string;

    variant: Variant;
    animation?: Animation | Animation[];
    adaptiveMode?: AdaptiveMode;
    active?: boolean;

    className?: string;
    styleProps?: React.CSSProperties;

    onClick: () => void;
}

export default function Button(propsOBJ: Props) {
    const animations = Array.isArray(propsOBJ.animation) ? propsOBJ.animation : propsOBJ.animation ? [propsOBJ.animation] : [];

    return (
        <button
            className={clsx(
                propsOBJ.className,
                s.button,
                s[`button--${propsOBJ.variant}`],
                animations.map(anim => a[`animation--${anim}`]),
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