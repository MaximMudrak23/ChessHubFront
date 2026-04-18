import s from './styles.module.scss'
import defaultPFP from './defaultPFP.png';
import clsx from 'clsx';

type Props = {
    userName: string;
    size: number;
    imgURL?: string;
    frameURL?: string;
    className?: string;
}

// style={size ? { width: size, height: size } : undefined} и в css вместо фита по 100% процентов

export default function UserAvatar({userName, size, imgURL, frameURL, className}: Props) {
    return (
        <div className={clsx(s.userAvatarContainer, className)}>
            <img
                className={s.userAvatar}
                src={imgURL ? imgURL : defaultPFP}
                alt={`${userName} Avatar`}
                draggable={false}
                style={{width: size, height: size}}
            />
            {frameURL && <img className={s.userAvatarFrame} src={frameURL} alt={`${userName} Avatar Frame`} />}
        </div>
    )
}