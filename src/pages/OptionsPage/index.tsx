import s from './styles.module.scss'
import UniversalContainer from '../../components/UniversalContainer'
import Folders from './components/Folders'
import EventScreen from './components/EventScreen'

export default function OptionsPage() {
    return (
        <>
            <UniversalContainer contentClassName={s.content}>
                <div className={s.title}>
                    <img src="/all/gear.svg" alt="Gear" />
                    <h1>Options</h1>
                </div>
                <main className={s.main}>
                    <Folders />
                    <EventScreen />
                </main>
            </UniversalContainer>
        </>
    )
}