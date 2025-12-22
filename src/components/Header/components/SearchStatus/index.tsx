import s from './styles.module.scss'

// Серч статус нужно наверное не в хеддер ставить, а ниже хеддера, но в теории норм в хеддере держать, чтобы 2 компонента не вставлять на постоянный рендер и все такое. правильно или нет не волнует, это моя идея я так чувствую.

export default function SearchStatus() {
    return (
        <div className={s.search_status}>
            <p>Finding game – 0:00</p>
            
            <div className={s.search_stop_search}>
                <img src="/closeIcon.svg" alt="Close Icon" draggable={false} />
                <p>Stop searching</p>
            </div>
        </div>
    )
}