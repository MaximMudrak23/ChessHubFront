import s from './styles.module.scss'

export default function FullScreenImage({imgURL, setIsFullSized}: {imgURL: string; setIsFullSized: (x: boolean) => void}) {
    return (
        <div className={s.fullscreen_image} onClick={() => setIsFullSized(false)}>
            <img src={imgURL} alt="FullScreen Image" />
        </div>
    )
}