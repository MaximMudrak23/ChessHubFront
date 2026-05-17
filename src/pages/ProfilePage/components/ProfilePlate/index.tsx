import s from './styles.module.scss'
import Lottie from 'lottie-react'
import songEffect from '../JSON/songEffect.json'

type Props = {
    text: string;
    imgURL?: string;
    isElo?: boolean;
    isSong?: boolean;
    onClick?: () => void;
    songActionIcon?: string;
}

export default function ProfilePlate(props: Props) {
    return (
        <div className={s.profile_plate} onClick={props.onClick}>
            {(props.isElo && props.text) &&
                <div className={s.elo_container}>
                    <span className={s.elo_label}>Elo: </span>
                    <span className={s.text_label}>{props.text}</span>
                </div>
            }

            {(props.isSong && props.text) &&
                <div className={s.song_container}>
                    <div className={s.song_icon_container}>
                        <Lottie
                            animationData={songEffect}
                            loop={true}
                            className={s.song_effect}
                        />

                        <img
                            src={props.imgURL}
                            alt="Song Icon"
                            draggable={false}
                            className={s.song_icon}
                        />
                        
                        {props.songActionIcon && (
                            <img
                                src={props.songActionIcon}
                                alt="Song Action"
                                draggable={false}
                                className={s.song_action_icon}
                            />
                        )}
                    </div>

                    <span className={s.text_label}>
                        {props.text}
                    </span>
                </div>
            }
        </div>
    )
}