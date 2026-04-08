import s from './styles.module.scss'
import Lottie from 'lottie-react'
import songEffect from '../JSON/songEffect.json'

type Props = {
    text: string;
    imgURL?: string;
    isElo?: boolean;
    isSong?: boolean;
}

export default function ProfilePlate({text, imgURL, isElo, isSong}: Props) {
    return (
        <div className={s.profile_plate}>
            {(isElo && text) &&
            <div className={s.elo_container}>
                <span className={s.elo_label}>Elo: </span>
                <span className={s.text_label}>{text}</span>
            </div>}

            {(isSong && text) &&
            <div className={s.song_container}>
                <Lottie animationData={songEffect} loop={true} className={s.song_effect} />
                <img src={imgURL} alt="Song Cover" draggable={false} />
                <span className={s.text_label}>{text}</span>
            </div>}
        </div>
    )
}