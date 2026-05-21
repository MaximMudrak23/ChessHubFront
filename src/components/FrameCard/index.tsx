import s from './styles.module.scss'
import clsx from 'clsx';
import UserAvatar from '../User/UserAvatar';

type Variant = 'profile' | 'shop';

type Props = {
    frameURL: string;
    variant: Variant;
    
    isActive?: boolean;
    name?: string;
    price?: number;
    onClick: () => void;
}

export default function FrameCard(props: Props) {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={clsx(
                s.frame_card,
                s[`frame_card--${props.variant}`],
                props.isActive && s.active
            )}
        >
            <UserAvatar
                userName="Frame"
                size={90}
                frameURL={props.frameURL}
                className={s.framecard_size}
                hideAvatar
            />

            {props.variant === 'shop' && (
                <div className={s.info}>
                    <p>{props.name}</p>
                    <span>{props.price} coins</span>
                </div>
            )}
        </button>
    )
}