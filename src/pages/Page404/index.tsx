import s from './styles.module.scss'
import Space from './components/Space'
import Planet from './components/Planet'
import Text from './components/Text'
import Button from '../../components/UI/Button'
import House from './House.svg'

export default function Page404() {
    return (
        <main className={s.page__404}>
            <Space />
            <Planet />
            <Text />
            <Button
                text={'Go Home'}
                imgURL={House}
                variant={'txtimg'}
                shape={'notfound_shape'}
                animation={'notfound_animation'}
                onClick={()=>''} 
            />
        </main>
    )
}