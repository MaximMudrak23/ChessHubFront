import s from './styles.module.scss'

// Later create input separate component, and fix button component too

export default function FindInput() {
    return (
        <form className={s.form_input}>
            <input type="text" placeholder='Who you want to find?' />
        </form>
    )
}