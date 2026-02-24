import s from './styles.module.scss'
import a from './animations.module.scss'

type Variant = 'green' | 'red' | 'black' | 'profile' | 'error' | 'welcome';
type Animation = 'game' | 'main' | 'error' | 'mini-jump';
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
            className={[
                s.button,
                s[`button--${propsOBJ.variant}`],
                propsOBJ.animation && a[`animation--${propsOBJ.animation}`],
                propsOBJ.active === false && s.inactive,
                propsOBJ.adaptiveMode === 'floating' && s.floating,
            ].filter(Boolean).join(' ')}
            disabled={propsOBJ.active === false}
            style={propsOBJ.styleProps}
            onClick={propsOBJ.onClick}
        >
            {propsOBJ.text && <span>{propsOBJ.text}</span>}
            {propsOBJ.icon && <img src={propsOBJ.icon} alt='Button Icon' />}
        </button>
    )
}