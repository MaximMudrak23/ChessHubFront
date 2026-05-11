import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import { getCurrentUser } from './utils/lib/getCurrentUser'
import { useState } from 'react'
import type { Side, Move } from './utils/types/game.types'
import type { Player, Players } from './utils/types/game.types'

const player1: Player = {
    side: 'white',
    isCurrentUser: true,
    userName: 'TAB ON ME',
    userElo: 2000,
    userIcons: [{title: 'Developer', iconURL: '/svg/checkmark.svg'}],
}
const player2: Player = {
    side: 'black',
    isCurrentUser: false,
    userName: 'long long long long long long long long',
    userElo: 2000,
    userIcons: [{title: 'Developer', iconURL: '/svg/checkmark.svg'}],
}
const players: Players = {
    white: player1,
    black: player2,
}

export default function GamePage() {
    const currentUser = getCurrentUser(players);
    const currentUserSide = currentUser?.side ?? null;
    const perspective = currentUser?.side ?? 'white';
    const [currentTurn, setCurrentTurn] = useState<Side>('white');
    const [moves, setMoves] = useState<Move[]>([]);

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