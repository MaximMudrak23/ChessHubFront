import s from './styles.module.scss'
import GalleryPhoto from './components/GalleryPhoto'

export default function ProfileGallery() {
    return (
        <section className={s.profile_gallery}>
            <GalleryPhoto imgURL='/i1.png' />
            <GalleryPhoto imgURL='/i2.png' />
            <GalleryPhoto imgURL='/i3.png' />
        </section>
    )
}