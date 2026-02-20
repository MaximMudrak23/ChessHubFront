import s from './styles.module.scss'
import UniversalContainer from '../../components/UniversalContainer'
import FindInput from './components/FindInput'
import FindCard from './components/FindCard'
import PageSlider from './components/PageSlider'

export default function SearchPage() {
    return (
        <>
            <UniversalContainer className={s.containerMain} contentClassName={s.content}>
                <FindInput />
                <div className={s.find_cards_container}>
                    <FindCard />
                    <FindCard />
                    <FindCard />
                    <PageSlider />
                </div>
            </UniversalContainer>
        </>
    )
}