import s from './styles.module.scss'
import Space from './myComponents/Space'
import Planet from './myComponents/Planet'
import Text from './myComponents/Text'
import AnimatedButton from '../../shared/AnimatedButton'

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