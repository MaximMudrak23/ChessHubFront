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
    const halfmoveClock = useGameStore(s => s.halfmoveClock);
    const fullmoveNumber = useGameStore(s => s.fullmoveNumber);
    const setHalfmoveClock = useGameStore(s => s.setHalfmoveClock);
    const setFullmoveNumber = useGameStore(s => s.setFullmoveNumber);
    const positionHistory = useGameStore(s => s.positionHistory);
    const setPositionHistory = useGameStore(s => s.setPositionHistory);

    if (!user || !players) return null;

    const currentPlayer = Object.values(players).find(
        p => p.userId === user.id
    );

    const currentUserSide = currentPlayer?.side ?? null;
    const perspective = currentPlayer?.side ?? 'white';
    const activePlayer = players[currentTurn];
    const isBotTurn = activePlayer.type === 'bot';

    return (
        <section className={s.game_page}>
            <ChessBoard
                currentUserSide={currentUserSide}
                perspective={perspective}
                currentTurn={currentTurn}
                setCurrentTurn={setCurrentTurn}
                setMoves={setMoves}
                isBotTurn={isBotTurn}
                halfmoveClock={halfmoveClock}
                fullmoveNumber={fullmoveNumber}
                setHalfmoveClock={setHalfmoveClock}
                setFullmoveNumber={setFullmoveNumber}
                positionHistory={positionHistory}
                setPositionHistory={setPositionHistory}
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