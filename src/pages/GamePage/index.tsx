import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import { players, moves } from './utils/data/test'
import { getCurrentUser } from './utils/lib/getCurrentUser'

export default function GamePage() {
    const currentUser = getCurrentUser(players);
    const currentUserSide = currentUser?.side ?? null;
    const perspective = currentUser?.side ?? 'white';

    return (
        <section className={s.game_page}>
            <ChessBoard
                currentUserSide={currentUserSide}
                perspective={perspective}
            />
            <SidePanel
                players={players}
                moves={moves}
                perspective={perspective}
            />
        </section>
    )
}