import s from './styles.module.scss'
import Space from './components/Space'
import Planet from './components/Planet'
import Text from './components/Text'
import Button from '@/components/UI/Button'
import { SVG } from '@/constants/paths'

export default function Page404() {
    return (
        <main className={s.page__404}>
            <Space />
            <Planet />
            <Text />
            <Button
                text={'Go Home'}
                icon={SVG.house}
                variant={'error'}
                animation={'error'}
                className={s.button}
                onClick={()=>''} 
            />
        </main>
    )
}