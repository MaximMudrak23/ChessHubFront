import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import { useUserStore } from '@/store/userStore'
import { useGameStore } from '@/store/gameStore'
import { useParams } from 'react-router-dom';
import { useLoadGame } from './components/ChessBoard/hooks/useLoadGame'
import { useGameSounds } from './hooks/useGameSounds'

export default function GamePage() {
    const { id } = useParams();

    const user = useUserStore(s => s.user);
    const players = useGameStore(s => s.players);
    const currentTurn = useGameStore(s => s.currentTurn);
    const moves = useGameStore(s => s.moves);
    const pieces = useGameStore(s => s.pieces);
    const lastMove = useGameStore(s => s.lastMove);
    const winnerSide = useGameStore(s => s.winnerSide);
    const gameId = useGameStore(s => s.gameId);
    
    useLoadGame(id);
    useGameSounds();
    
    const currentPlayer = user && players
        ? Object.values(players).find(p => String(p.userId) === String(user.id))
        : null;
    
    if (!user || !players || gameId !== id) return null;
    
    const currentUserSide = currentPlayer?.side ?? null;
    const perspective = currentPlayer?.side ?? 'white';

    return (
        <section className={s.game_page}>
            <ChessBoard
                currentUserSide={currentUserSide}
                perspective={perspective}
                currentTurn={currentTurn}
                winnerSide={winnerSide}
                pieces={pieces}
                lastMove={lastMove}
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
