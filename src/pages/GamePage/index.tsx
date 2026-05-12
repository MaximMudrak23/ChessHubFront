import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import { useUserStore } from '@/store/userStore'
import { useGameStore } from '@/store/gameStore'

export default function GamePage() {
    const user = useUserStore(s => s.user);
    const players = useGameStore(s => s.players);
    const currentTurn = useGameStore(s => s.currentTurn);
    const setCurrentTurn = useGameStore(s => s.setCurrentTurn);
    const moves = useGameStore(s => s.moves);
    const setMoves = useGameStore(s => s.setMoves);

    if (!user || !players) return null;

    const currentPlayer = Object.values(players).find(
        p => p.userId === user.id
    );

    const currentUserSide = currentPlayer?.side ?? null;
    const perspective = currentPlayer?.side ?? 'white';

    return (
        <section className={s.game_page}>
            <ChessBoard
                currentUserSide={currentUserSide}
                perspective={perspective}
                currentTurn={currentTurn}
                setCurrentTurn={setCurrentTurn}
                setMoves={setMoves}
            />
            <SidePanel
                players={players}
                moves={moves}
                perspective={perspective}
                currentTurn={currentTurn}
            />
        </section>
    )
}