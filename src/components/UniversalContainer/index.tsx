import s from './styles.module.scss'

type defaultProps = {
    children?: React.ReactNode;
    
    className?: string;
    style?: React.CSSProperties;
    contentClassName?: string;
    contentStyle?: React.CSSProperties;
}

type Props = 
    | defaultProps & {srcIMG: string; srcVideo?: never;}
    | defaultProps & {srcIMG?: never; srcVideo: string;}
    | defaultProps & {srcIMG?: never; srcVideo?: never;}

export default function UniversalContainer({
    className,
    style,
    contentClassName,
    contentStyle,
    children,
    srcIMG,
    srcVideo
}: Props) {
    const containerClasses = [s.container, className].filter(Boolean).join(' ');
    const contentClasses = [s.content, contentClassName].filter(Boolean).join(' ');
    return (
        <section
            className={`${containerClasses}
            ${(srcIMG || srcVideo) ? s.profile_gradient : s.default_gradient}`}
            style={style}
        >
            
            <div className={`${s.background} ${(srcIMG || srcVideo) ? s.background_transition : ''}`}>
                {(srcIMG && !srcVideo) && <img src={srcIMG} alt="Background Image" />}
                {(srcVideo && !srcIMG) && <video src={srcVideo} autoPlay loop muted playsInline disablePictureInPicture></video>}
            </div>

            <div className={contentClasses} style={contentStyle}>
                {children}
            </div>
            
        </section>
    )
}