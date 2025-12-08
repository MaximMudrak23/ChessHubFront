import s from './styles.module.scss'

type Props = {
    src?: string;
    backgroundType?: 'img' | 'video';
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export default function UniversalContainer({src, backgroundType, className, style, children,}: Props) {
    return (
        <section className={`${s.container} ${className}`} style={style}>
            <div className={s.background}>
                {backgroundType === 'img' && <img src={src} alt="Background Image" />}
                {backgroundType === 'video' && <video src={src} autoPlay loop muted playsInline disablePictureInPicture></video>}
            </div>
            <div className={s.content}>{children}</div>
        </section>
    )
}