import s from './styles.module.scss'
import Header from '../../shared/Header'
import ContentContainer from './myComponents/ContentContainer'
import FindGameButton from './myComponents/FindGameButton'

export default function MainPage() {
    return (
        <main className={s.main__page}>
            <Header />
            <ContentContainer />
            <FindGameButton />
        </main>
    )
}