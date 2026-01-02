import s from './styles.module.scss'
import FullScreenImage from '../FullScreenImage'
import { useState } from 'react'

export default function GalleryPhoto({imgURL}: {imgURL: string}) {
    const [isFullSized, setIsFullSized] = useState(false);
    return (
        <>
            <div className={s.gallery_photo}>
                <img src={imgURL} alt='Gallery Photo' />
                <div className={s.gallery_photo_hover} onClick={()=>setIsFullSized(x => !x)}>
                    <img src="/watchGalleryIcon.svg" alt="Gallery Hover" draggable={false} />
                </div>
            </div>
            {isFullSized && <FullScreenImage imgURL={imgURL} setIsFullSized={setIsFullSized} />}
        </>
    )
}