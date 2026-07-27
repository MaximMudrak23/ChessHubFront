type SoundName =
    | 'capture'
    | 'castle'
    | 'game-end'
    | 'game-start'
    | 'illegal'
    | 'move-check'
    | 'move-self'
    | 'promote';

let lastStartedGameId: string | null = null;

export function playSound(name: SoundName) {
    const audio = new Audio(`/chess-sounds/${name}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
}

export function playGameStartOnce(gameId: string) {
    if (lastStartedGameId === gameId) return;

    lastStartedGameId = gameId;
    playSound('game-start');
}