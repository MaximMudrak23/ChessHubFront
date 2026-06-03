import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import { useUserStore } from '@/store/userStore'
import { useGameStore } from '@/store/gameStore'
import { useParams } from 'react-router-dom';
import { useLoadGame } from './components/ChessBoard/hooks/useLoadGame'
import { useFinishGame } from './components/ChessBoard/hooks/useFinishGame'
import { useGameSocket } from './hooks/useGameSocket'
import { useGameSounds } from './hooks/useGameSounds'
import { useEffect } from 'react'

export default function GamePage() {
    const { id } = useParams();

    const user = useUserStore(s => s.user);
    const players = useGameStore(s => s.players);
    const currentTurn = useGameStore(s => s.currentTurn);
    const moves = useGameStore(s => s.moves);
    const pieces = useGameStore(s => s.pieces);
    const lastMove = useGameStore(s => s.lastMove);
    const gameId = useGameStore(s => s.gameId);
    const clearGame = useGameStore(s => s.clearGame);
    
    useLoadGame(id);
    useFinishGame();
    useGameSocket(gameId);
    useGameSounds();

    
    const currentPlayer = user && players
    ? Object.values(players).find(p => p.userId === user.id)
    : null;
    
    const isSpectator = Boolean(user && players && !currentPlayer);
    
    useEffect(() => {
        return () => {
            if (isSpectator) {
                clearGame();
            }
        };
    }, [isSpectator, clearGame]);
    
    if (!user || !players) return null;
    
    const currentUserSide = currentPlayer?.side ?? null;
    const perspective = currentPlayer?.side ?? 'white';

    return (
        <section className={s.game_page}>
            <ChessBoard
                currentUserSide={currentUserSide}
                perspective={perspective}
                currentTurn={currentTurn}
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