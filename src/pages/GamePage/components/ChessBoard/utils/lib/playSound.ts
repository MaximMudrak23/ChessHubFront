type SoundName = 'capture' | 'castle' | 'game-end' | 'game-start' | 'illegal' | 'move-check' | 'move-self' | 'promote';

export function playSound(name: SoundName) {
    const audio = new Audio(`/chess-sounds/${name}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
}