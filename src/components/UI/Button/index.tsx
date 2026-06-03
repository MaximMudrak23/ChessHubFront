import s from './styles.module.scss'
import a from './animations.module.scss'
import clsx from 'clsx';

type Variant = 'none' | 'green' | 'red' | 'blue' | 'black' | 'profile' | 'error' | 'welcome' | 'glass' | 'transparent';
type Animation = 'game' | 'main' | 'floating' | 'mini-jump' | 'white-hover'| 'hover-icon' | 'rec-text';

type Props = {
    text?: string;
    icon?: string;
    effect?: React.ReactNode;

    variant: Variant;
    animation?: Animation | Animation[];
    active?: boolean;

    className?: string;
    styleProps?: React.CSSProperties;

    onClick: () => void;
}

export default function Button(props: Props) {
    const animations = Array.isArray(props.animation)
        ? props.animation
        : props.animation
            ? [props.animation]
            : [];

    return (
        <button
            className={clsx(
                props.className,
                s.button,
                s[`button--${props.variant}`],
                animations.map(anim => a[`animation--${anim}`]),
                props.active === false && s.inactive,
            )}
            disabled={props.active === false}
            style={props.styleProps}
            onClick={props.onClick}
        >
            {props.effect && (
                <span className={s.effect}>
                    {props.effect}
                </span>
            )}
            {props.text && <span>{props.text}</span>}
            {props.icon && <img src={props.icon} alt='Button Icon' draggable={false} />}
        </button>
    )
}