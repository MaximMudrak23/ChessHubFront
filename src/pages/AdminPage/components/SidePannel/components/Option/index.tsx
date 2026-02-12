import s from './styles.module.scss'

type Props = {
    name: string;
    imgURL?: string;
    isActive?: boolean;
    onClick: () => void;
}

export default function Option({name, imgURL, isActive, onClick}: Props) {
    return (
        <section
            className={`${s.option} ${isActive ? s.active : ''}`}
            onClick={onClick}
        >
            {imgURL && <img src={imgURL} alt="Option Icon" />}
            <p>{name}</p>
        </section>
    )
}