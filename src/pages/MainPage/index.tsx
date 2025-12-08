import s from './styles.module.scss'
import Header from '../../shared/Header'
import UniversalContainer from '../../shared/UniversalContainer'
import Button from '../../shared/Button'

export default function MainPage() {
    return (
        <main className={s.main__page}>
            <Header />
            <UniversalContainer className={s.zxc} >
                <p>Unfortunately, I haven't figured out what to put on this page yet, so it's empty for now. 😢</p>
            </UniversalContainer>
            <Button text='Find Game' radius={5} fontSize='1.6rem' width='375px' height='75px' background='#3F6730' position='fixed' right='32px' bottom='32px' onClick={()=>''} />
        </main>
    )
}