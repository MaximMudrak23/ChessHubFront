import s from './styles.module.scss'

export default function HeaderOptions() {
    return (
        <section className={s.header__options}>
            <div className={s.optionWrapper}>
                <img className={s.optionIMG} src="/OptionsIcon.svg" alt="Options" />
                <p className={s.option__hover__text}>Options</p>
            </div>
            <div className={s.optionWrapper}>
                <img className={s.optionIMG} src="/SearchIcon.svg" alt="Search" />
                <p className={s.option__hover__text}>Search</p>
            </div>
            <div className={s.optionWrapper}>
                <img className={s.optionIMG} src="/ProfileIcon.svg" alt="Profile" />
                <p className={s.option__hover__text}>Profile</p>
            </div>
        </section>
    )
}