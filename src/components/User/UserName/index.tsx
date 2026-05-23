import s from './styles.module.scss'
import clsx from 'clsx'
import type { IconType } from '@/types/user.types'
import { getFileURL } from '@/utils/getFileURL'

type Props = {
    userName: string;
    variation: 'profile' | 'card';
    Icons?: IconType[];
    className?: string;
    styleProps?: React.CSSProperties;
}

export default function UserName({ userName, variation, Icons, className, styleProps }: Props) {
    return (
        <div
            className={clsx(s.userName, s[`userName--${variation}`], className)}
            style={styleProps}
        >
            <span>
                {userName}
            </span>

            {Icons?.map((icon, i) => (
                <img key={i} src={getFileURL(icon.iconURL)} alt={`Icon ${i}`} />
            ))}
        </div>
    )
}