import s from './styles.module.scss'
import Space from './components/Space'
import Planet from './components/Planet'
import Text from './components/Text'
import Button from '@/components/UI/Button'
import { SVG } from '@/constants/paths'
import { useNavigate } from 'react-router-dom'

export default function Page404() {
    const navigate = useNavigate();

    return (
        <main className={s.page__404}>
            <Space />
            <Planet />
            <Text />
            <Button
                text={'Go Home'}
                icon={SVG.house}
                variant={'error'}
                animation={['hover-icon', 'flying']}
                className={s.button}
                onClick={() => navigate('/main')} 
            />
        </main>
    )
}