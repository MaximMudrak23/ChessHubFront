import s from './styles.module.scss'

type defaultProps = {
    children?: React.ReactNode;
    styleProps?: React.CSSProperties;
}

type Props = 
    | defaultProps & {srcIMG: string; srcVideo?: never;}
    | defaultProps & {srcIMG?: never; srcVideo: string;}
    | defaultProps & {srcIMG?: never; srcVideo?: never;}

export default function SteamContentWrapper({children, styleProps, srcIMG, srcVideo}: Props) {
    return (
        <section className={s.steamContentWrapper}>
            <div className={s.background}>
                {srcIMG && <img src={srcIMG} alt='Background Image' draggable={false} />}
                {srcVideo && <video src={srcVideo} autoPlay loop muted playsInline disablePictureInPicture />}
            </div>
            <div className={s.content} style={styleProps}>
                {children}
            </div>
        </section>
    )
}