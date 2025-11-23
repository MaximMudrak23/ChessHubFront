import s from './styles.module.scss'

export default function HeaderOptions() {
    return (
        <section className={s.header__options}>
            <div className={s.optionWrapper}>
                <img className={s.optionIMG} src="/OptionsIcon.svg" alt="Options" draggable={false} />
                <p className={s.option__hover__text}>Options</p>
            </div>
            <div className={s.optionWrapper}>
                <img className={s.optionIMG} src="/SearchIcon.svg" alt="Search" draggable={false} />
                <p className={s.option__hover__text}>Search</p>
            </div>
            <div className={s.optionWrapper}>
                <img className={s.optionIMG} src="/ProfileIcon.svg" alt="Profile" draggable={false} />
                <p className={s.option__hover__text}>Profile</p>
            </div>
            <div className={s.optionWrapper}>
                <img className={s.optionIMG} src="/MenuIcon.svg" alt="Profile" draggable={false} />
                <p className={s.option__hover__text}>Menu</p>
            </div>
        </section>
    )
}