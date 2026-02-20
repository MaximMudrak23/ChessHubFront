import s from './styles.module.scss'
import a from './animations.module.scss'

type Variant = 'green' | 'red' | 'black' | 'profile' | 'error';
type Animation = 'game' | 'main' | 'error';
type AdaptiveMode = 'floating';

type Props = {
    text?: string;
    icon?: string;

    variant: Variant;
    animation?: Animation;
    adaptiveMode?: AdaptiveMode;
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
                propsOBJ.adaptiveMode === 'floating' && s.floating,
            ].filter(Boolean).join(' ')}
            style={propsOBJ.styleProps}
            onClick={propsOBJ.onClick}
        >
            {propsOBJ.text && <span>{propsOBJ.text}</span>}
            {propsOBJ.icon && <img src={propsOBJ.icon} alt='Button Icon' />}
        </button>
    )
}