import s from './styles.module.scss'
import { getFileURL } from '@/utils/getFileURL';

type BackgroundType = 'image' | 'video';

type Props = {
    type: BackgroundType;
    url: string;
    onClick?: () => void;
    isActive?: boolean;
}

export default function BackgroundCard(props: Props) {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={`${s.background_card} ${props.isActive ? s.active : ''}`}
        >
            {props.type === 'image' ? (
                <img
                    src={getFileURL(props.url)}
                    alt="Profile Background"
                    draggable={false}
                />
            ) : (
                <video
                    src={getFileURL(props.url)}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            )}
        </button>
    )
}