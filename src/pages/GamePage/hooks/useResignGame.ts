import { finishGame } from '@/api/gameApi';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';

export function useResignGame() {
    const token = useUserStore(s => s.token);
    const user = useUserStore(s => s.user);
    const setUser = useUserStore(s => s.setUser);

    const gameId = useGameStore(s => s.gameId);
    const players = useGameStore(s => s.players);
    const moves = useGameStore(s => s.moves);
    const gameStatus = useGameStore(s => s.gameStatus);

    const currentPlayer = user && players
        ? Object.values(players).find(p => String(p.userId) === String(user.id))
        : null;

    const canResign = Boolean(
        token &&
        gameId &&
        currentPlayer &&
        gameStatus === 'playing'
    );

    async function resignGame() {
        if (!token || !gameId || !currentPlayer) return;

        const confirmed = window.confirm('Resign the game?');
        if (!confirmed) return;

        const winner = currentPlayer.side === 'white' ? 'black' : 'white';

        try {
            const data = await finishGame(token, {
                gameId,
                winner,
                finishedReason: 'resignation',
                moves,
            });

            if (data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return {
        canResign,
        resignGame,
    };
}