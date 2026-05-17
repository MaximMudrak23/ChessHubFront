import s from './styles.module.scss'
import { getFileURL } from '@/utils/getFileURL';

type Props = {
    songName: string;
    songAuthor: string;
    songAvatarURL: string;

    onClick?: () => void;
    isActive?: boolean;
}

export default function SongCard(props: Props) {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={`${s.song_card} ${props.isActive ? s.active : ''}`}
        >
            <img
                className={s.song_avatar}
                src={getFileURL(props.songAvatarURL)}
                alt={props.songName}
                draggable={false}
            />

            <div className={s.info}>
                <h3>{props.songName}</h3>
                <span>{props.songAuthor}</span>
            </div>
        </button>
    )
}