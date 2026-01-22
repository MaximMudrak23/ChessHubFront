import s from './styles.module.scss'

export default function PageSlider() {
    return (
        <div className={s.find_card}>
            <button>
                <img src="/all/findLeft.svg" alt="" />
            </button>
            
            <span>Page 1</span>
            
            <button>
                <img src="/all/findRight.svg" alt="" />
            </button>
        </div>
    )
}