import s from './styles.module.scss'
import Lottie from 'lottie-react'
import notes from './notes.json'

type Props = {
    isElo?: boolean;
    isMusic?: boolean;
    isOther?: boolean;

    userElo?: number;
    songIMG?: string;
    songName?: string;
    className?: string;
}

export default function ProfileOption({isElo, isMusic, isOther, userElo, songIMG, songName, className}: Props) {
    const classes = [s.option, className].filter(Boolean).join(' ');
    return (
        <div className={classes}>
            {isElo && <p className={s.eloTXT}>Elo: {userElo ? userElo : 'null'}</p>}
            {isMusic &&
                <>
                    <div className={s.song_image}>
                        <img src={songIMG} alt="Profile Song IMG" />
                        <Lottie animationData={notes} loop={true} className={s.notes} />
                    </div>
                    <span className={s.songTXT}>{songName}</span>
                </>
            }
            {isOther && <p>Edit Profile</p>}
        </div>
    )
}