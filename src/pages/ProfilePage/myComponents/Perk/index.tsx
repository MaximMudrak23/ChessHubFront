import s from './styles.module.scss'
import Lottie from 'lottie-react'
import MusicFly from './MusicFly.json'

type Props = {
    perkType?: 'elo' | 'song' | 'other';
    imgSrc?: string;
    text?: string;
}

export default function Perk({perkType='other', imgSrc, text}: Props) {
    return (
        <div className={perkType === 'other' || perkType === 'elo' ? `${s.perk} ${s.otherBehavior}` : s.perk}>
            {perkType === 'song' && <div className={s.song_image_container}>
                <img src={imgSrc} alt="Perk IMG" />
                <Lottie className={s.lottie} animationData={MusicFly} loop={true} />
            </div>}
            <span>{perkType === 'elo' ? `${text} elo` : text}</span>
        </div>
    )
}