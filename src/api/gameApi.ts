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

export async function findGame(token: string) {
    const res = await fetch(`${API_URL}/game/find`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to find game');
    }

    return res.json();
}

export async function cancelSearch(token: string) {
    const res = await fetch(`${API_URL}/game/cancel-search`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to cancel search');
    }

    return res.json();
}

export async function finishGame(
    token: string,
    data: {
        gameId: string;
        winner: 'white' | 'black' | 'draw';
        finishedReason: string;
        moves: unknown[];
    }
) {
    const res = await fetch(`${API_URL}/game/finish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Failed to finish game');
    }

    return res.json();
}

export async function getGameById(id: string) {
    const res = await fetch(`${API_URL}/game/by-id/${id}`);

    if (!res.ok) {
        throw new Error('Failed to get game');
    }

    return res.json();
}

export async function getActiveGame(token: string) {
    const res = await fetch(`${API_URL}/game/active-game`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to get active game');
    }

    return res.json();
}