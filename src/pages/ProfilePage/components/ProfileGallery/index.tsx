import s from './styles.module.scss'
import GalleryPhoto from './components/GalleryPhoto'

export default function ProfileGallery() {
    return (
        <section className={s.profile_gallery}>
            <GalleryPhoto imgURL='/all/i1.png' />
            <GalleryPhoto imgURL='/all/i2.png' />
            <GalleryPhoto imgURL='/all/i3.png' />
        </section>
    )
}