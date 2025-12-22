import s from './styles.module.scss'
import ProfileOption from '../Options'

type Props = {
    userElo: number;
    songIMG?: string;
    songName?: string;
    className?: string;
}

export default function ProfileOptionsContainer( {userElo, songIMG, songName, className}: Props) {
    const classArray = [s.profile_options_container, className].filter(Boolean).join(' ');
    return (
        <section className={classArray}>
            <ProfileOption isElo userElo={userElo} />
            {(songIMG && songName) && <ProfileOption isMusic songIMG={songIMG} songName={songName} />}
            <ProfileOption isOther className={s.hover_behavior} />
        </section>
    )
}