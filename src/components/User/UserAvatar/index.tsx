import s from './styles.module.scss'
import defaultPFP from './defaultPFP.png';
import clsx from 'clsx';
import type { style } from 'framer-motion/client';

type Props = {
    userName: string;
    size: string;
    imgURL?: string;
    frameURL?: string;
    className?: string;
}

export default function UserAvatar({userName, size, imgURL, frameURL, className}: Props) {
    return (
        <div className={clsx(s.userAvatarContainer, className)} style={{maxWidth: size, maxHeight: size}}>
            <img
                className={s.userAvatar}
                src={imgURL ? imgURL : defaultPFP}
                alt={`${userName} Avatar`}
                draggable={false}
                style={{width: `${size}`, height: `${size}`}}
            />
            {frameURL && <img className={s.userAvatarFrame} src={frameURL} alt={`${userName} Avatar Frame`} />}
        </div>
    )
}