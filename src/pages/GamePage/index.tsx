import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import { useUserStore } from '@/store/userStore'
import { useGameStore } from '@/store/gameStore'
import { useParams } from 'react-router-dom';
import { useLoadGame } from './components/ChessBoard/hooks/useLoadGame'
import { useGameSounds } from './hooks/useGameSounds'
import { useMoveNavigation } from './hooks/useMoveNavigation'

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
    const isActive = useGameStore(s => s.isActive);
    const gameStatus = useGameStore(s => s.gameStatus);
    const isMovePending = useGameStore(s => s.isMovePending);
    
    const isLoaded = useLoadGame(id);
    useGameSounds(isLoaded ? id : undefined);
    const navigation = useMoveNavigation(id);
    
    const currentPlayer = user && players
        ? Object.values(players).find(p => String(p.userId) === String(user.id))
        : null;
    
    if (!isLoaded || !user || !players || gameId !== id) return null;
    
    const currentUserSide = currentPlayer?.side ?? null;
    const perspective = currentPlayer?.side ?? 'white';
    const displayTurn = navigation.position?.currentTurn ?? currentTurn;
    const analysisMode = navigation.canNavigate && (!isActive || navigation.position !== null);
    const canInteract = !isMovePending && (analysisMode || (isActive && gameStatus === 'playing' &&
        currentUserSide !== null && currentUserSide === currentTurn));

    return (
        <section className={s.game_page}>
            <ChessBoard
                key={gameId}
                interactionKey={`${navigation.viewRevision}:${navigation.navigationPly}:${displayTurn}:${canInteract}:${analysisMode}`}
                canInteract={canInteract}
                analysisMode={analysisMode}
                currentUserSide={currentUserSide}
                perspective={perspective}
                currentTurn={displayTurn}
                winnerSide={winnerSide}
                pieces={navigation.position?.pieces ?? pieces}
                animationPieces={navigation.animationPieces}
                lastMove={navigation.position ? navigation.position.lastMove : lastMove}
            />
            <SidePanel
                players={players}
                moves={moves}
                perspective={perspective}
                currentTurn={displayTurn}
                viewedPly={navigation.viewedPly}
                canNavigate={navigation.canNavigate}
                onSelectPly={navigation.selectPly}
                navigationPly={navigation.navigationPly}
                lastNavigationPly={navigation.lastNavigationPly}
                isVariation={navigation.isVariation}
                onNavigate={navigation.navigatePosition}
            />
        </section>
    )
}
