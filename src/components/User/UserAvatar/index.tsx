import s from './styles.module.scss'
import defaultPFP from './defaultPFP.png';
import clsx from 'clsx';
import { getFileURL } from '@/utils/getFileURL';

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
                src={imgURL ? getFileURL(imgURL) : defaultPFP}
                alt={`${userName} Avatar`}
                draggable={false}
                style={{width: size, height: size}}
            />
            {frameURL && <img className={s.userAvatarFrame} src={getFileURL(frameURL)} alt={`${userName} Avatar Frame`} />}
        </div>
    )
}