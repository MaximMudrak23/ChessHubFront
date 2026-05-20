import { API_URL } from './config';

export async function getBotMove(fen: string, skillLevel: number) {
    const res = await fetch(`${API_URL}/game/bot-move`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fen,
            skillLevel,
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to get bot move');
    }

    return res.json() as Promise<{ move: string }>;
}