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
            radius={5}
            fontSize='1.6rem'
            width='375px'
            height='75px'
            background='#3F6730'
            position='fixed'
            right='32px'
            bottom='32px'
            isSearchButton
            onClick={()=>''} />
        </>
    )
}