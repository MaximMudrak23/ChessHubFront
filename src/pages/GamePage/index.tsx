import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import { useUserStore } from '@/store/userStore'
import { useGameStore } from '@/store/gameStore'
import { useEffect, useRef, useState } from 'react';
import { finishGame } from '@/api/gameApi';
import type { GameStatus } from './components/ChessBoard/utils/types/chess.types';
import { useParams } from 'react-router-dom';
import { getGameById } from '@/api/gameApi';
import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame';
import { saveGameState } from '@/api/gameApi';

export default function GamePage() {
    const { id } = useParams();
    const setGame = useGameStore(s => s.setGame);

    const user = useUserStore(s => s.user);
    const players = useGameStore(s => s.players);
    const currentTurn = useGameStore(s => s.currentTurn);
    const setCurrentTurn = useGameStore(s => s.setCurrentTurn);
    const moves = useGameStore(s => s.moves);
    const setMoves = useGameStore(s => s.setMoves);
    const pieces = useGameStore(s => s.pieces);
    const setPieces = useGameStore(s => s.setPieces);
    const lastMove = useGameStore(s => s.lastMove);
    const setLastMove = useGameStore(s => s.setLastMove);
    const halfmoveClock = useGameStore(s => s.halfmoveClock);
    const setHalfmoveClock = useGameStore(s => s.setHalfmoveClock);
    const fullmoveNumber = useGameStore(s => s.fullmoveNumber);
    const setFullmoveNumber = useGameStore(s => s.setFullmoveNumber);
    const positionHistory = useGameStore(s => s.positionHistory);
    const setPositionHistory = useGameStore(s => s.setPositionHistory);
    const [gameStatus, setGameStatus] = useState<GameStatus>('playing');

    const token = useUserStore(s => s.token);
    const gameId = useGameStore(s => s.gameId);
    const setUser = useUserStore(s => s.setUser);

    useEffect(() => {
        // if (players) return;
        if (!id) return;

        getGameById(id)
            .then(data => {
                setGame(mapServerGameToClientGame(data.game));
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, setGame]);

    useEffect(() => {
        if (!token || !gameId) return;
        if (!pieces.length) return;

        saveGameState(token, {
            gameId,
            pieces,
            currentTurn,
            moves,
            lastMove,
            halfmoveClock,
            fullmoveNumber,
            positionHistory,
        }).catch(error => {
            console.log(error);
        });
    }, [
        token,
        gameId,
        pieces,
        currentTurn,
        moves,
        lastMove,
        halfmoveClock,
        fullmoveNumber,
        positionHistory,
    ]);

    const hasFinishedGame = useRef(false);

    useEffect(() => {
        if (!token || !gameId) return;
        if (gameStatus === 'playing') return;
        if (hasFinishedGame.current) return;

        hasFinishedGame.current = true;

        const winner =
            gameStatus === 'checkmate'
                ? currentTurn === 'white' ? 'black' : 'white'
                : 'draw';

        finishGame(token, {
            gameId,
            winner,
            finishedReason: gameStatus,
            moves,
        }).then(data => {
            if (data.user) {
                setUser(data.user);
            }
        }).catch(error => {
            console.log(error);
        });
    }, [gameStatus, token, gameId, currentTurn, moves]);

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
                pieces={pieces}
                setPieces={setPieces}
                lastMove={lastMove}
                setLastMove={setLastMove}
                isBotTurn={isBotTurn}
                halfmoveClock={halfmoveClock}
                fullmoveNumber={fullmoveNumber}
                setHalfmoveClock={setHalfmoveClock}
                setFullmoveNumber={setFullmoveNumber}
                positionHistory={positionHistory}
                setPositionHistory={setPositionHistory}
                setGameStatus={setGameStatus}
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