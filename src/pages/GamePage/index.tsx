import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import { players } from './utils/data/test'
import { getCurrentUser } from './utils/lib/getCurrentUser'
import type { Side, Move } from './utils/types/game.types'
import { useState } from 'react'

export default function GamePage() {
    const currentUser = getCurrentUser(players);
    const currentUserSide = currentUser?.side ?? null;
    const perspective = currentUser?.side ?? 'white';
    const [currentTurn, setCurrentTurn] = useState<Side>('white');
    const [moves, setMoves] = useState<Move[]>([
        {whiteMove: '', blackMove: ''},
        {whiteMove: '', blackMove: ''},
        {whiteMove: '', blackMove: ''},
        {whiteMove: '', blackMove: ''},
        {whiteMove: '', blackMove: ''},
        {whiteMove: '', blackMove: ''},
        {whiteMove: '', blackMove: ''},
    ]);

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