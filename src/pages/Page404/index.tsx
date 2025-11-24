import s from './styles.module.scss'
import Header from '../../shared/Header'
import Space from './myComponents/Space'
import Planet from './myComponents/Planet'
import Text from './myComponents/Text'

export default function Page404() {
    return (
        <main className={s.page__404}>
            <Header />
            <Space />
            <Planet />
            <Text />
        </main>
    )
}