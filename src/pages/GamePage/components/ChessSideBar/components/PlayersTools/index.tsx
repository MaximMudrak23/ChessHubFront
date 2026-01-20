import s from './styles.module.scss'
import PlayerCard from './components/PlayerCard'
import Timer from './components/Timer'

export default function PlayersTools() {
    return (
        <div className={s.players_tools}>
            <PlayerCard />
            <Timer />
            <Timer />
            <PlayerCard />
        </div>
    )
}