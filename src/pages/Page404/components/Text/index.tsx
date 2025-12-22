import s from './styles.module.scss'

export default function Text() {
    const text = "DANG IT! IT SEEMS THIS PAGE IS NOT EXIST...";
    return (
        <section className={s.text}>
            { Array.from(text).map((char, i) => ( <span key={i}>{char}</span> )) }
        </section>
    )
}