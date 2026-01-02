import s from './styles.module.scss'
import Space from './components/Space'
import Planet from './components/Planet'
import Text from './components/Text'
import AnimatedButton from '../../components/UI/AnimatedButton'

export default function Page404() {
    return (
        <main className={s.page__404}>
            <Space />
            <Planet />
            <Text />
            <AnimatedButton img='/HomeIcon.svg' text='Go Home' color='linear-gradient(to bottom, #C9C5D7, #594D82)' onClick={()=>''} />
        </main>
    )
}