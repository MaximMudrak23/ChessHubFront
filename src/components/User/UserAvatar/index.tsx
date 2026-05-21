import s from './styles.module.scss'
import defaultPFP from './defaultPFP.png';
import clsx from 'clsx';
import { getFileURL } from '@/utils/getFileURL';

type Props = {
    userName: string;
    size: number;
    imgURL?: string;
    frameURL?: string;
    hideAvatar?: boolean;
    className?: string;
}

// style={size ? { width: size, height: size } : undefined} и в css вместо фита по 100% процентов

export default function UserAvatar(props: Props) {
    return (
        <div className={
            clsx(s.userAvatarContainer, props.className)}
        >
            {!props.hideAvatar &&
                <img
                    className={s.userAvatar}
                    src={props.imgURL ? getFileURL(props.imgURL) : defaultPFP}
                    alt={`${props.userName} Avatar`}
                    draggable={false}
                    style={{width: props.size, height: props.size}}
                />
            }
            {props.frameURL && <img className={s.userAvatarFrame} src={getFileURL(props.frameURL)} alt={`${props.userName} Avatar Frame`} />}
        </div>
    )
}