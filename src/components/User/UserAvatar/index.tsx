import s from './styles.module.scss'
import UserAvatarFrame from "../UserAvatarFrame"
import defaultPFP from './defaultPFP.png';

type Props = {
    userName: string;
    size: string;
    imgURL?: string;
    frameURL?: string;
    className?: string;
}

export default function UserAvatar({userName, size, imgURL, frameURL, className}: Props) {
    const classes = [s.userAvatarContainer, className].filter(Boolean).join(' ');
    return (
        <div className={classes}>
            <img
                className={s.userAvatar}
                src={imgURL ? imgURL : defaultPFP}
                alt={`${userName} Avatar`}
                draggable={false}
                style={{width: `${size}`, height: `${size}`}}
            />
            {frameURL && <UserAvatarFrame userName={userName} frameURL={frameURL} />}
        </div>
    )
}