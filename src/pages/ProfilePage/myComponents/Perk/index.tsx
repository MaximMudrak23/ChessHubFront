import s from './styles.module.scss'
import Lottie from 'lottie-react'
import MusicFly from './MusicFly.json'

type Props = {
    perkType?: 'elo' | 'song' | 'other';
    imgSrc?: string;
    text?: string;
}

export default function Perk({perkType='other', imgSrc, text}: Props) {
    const eloPerk = perkType === 'elo';
    const songPerk = perkType === 'song';
    const topPerks = eloPerk || songPerk;
    
    const classes = [
        s.perk,
        topPerks && s.topPerkBehavior,
    ].filter(Boolean).join(' ');
    return (
        <div className={classes}>
            {songPerk && <div className={s.song_image_container}>
                <img src={imgSrc} alt="Perk IMG" />
                <Lottie className={s.lottie} animationData={MusicFly} loop={true} />
            </div>}
            <span>{eloPerk ? `${text} elo` : text}</span>
        </div>
    )
}