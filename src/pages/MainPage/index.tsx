import s from './styles.module.scss'
import UniversalContainer from '../../components/UniversalContainer'
import Button from '../../components/UI/Button'

export default function MainPage() {
    return (
        <>
            <UniversalContainer className={s.containerMain} contentClassName={s.content}>
                <p>Unfortunately, I haven't figured out what to put on this page yet, so it's empty for now. 😢</p>
            </UniversalContainer>
            <Button
                text='Find Game'
                variant='txt'
                animation='main_animation'
                shape='main_shape'
                onClick={()=>''}
            />
        </>
    )
}