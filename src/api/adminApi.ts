import { API_URL } from './config'
import type { User } from '@/types/user.types'

export async function getAdminUsers(token: string): Promise<{ users: User[] }> {
    const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

export async function deleteAdminUser(token: string, id: string) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

type AdminKey = {
    _id: string;
    code: string;
    createdAt: string;
    updatedAt: string;
};

export async function getAdminKeys(token: string): Promise<{ keys: AdminKey[] }> {
    const res = await fetch(`${API_URL}/admin/keys`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

export async function createAdminKey(token: string): Promise<{ key: AdminKey }> {
    const res = await fetch(`${API_URL}/admin/keys`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

export async function deleteAdminKey(token: string, id: string) {
    const res = await fetch(`${API_URL}/admin/keys/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

type CreateBotData = {
    name: string;
    botType: 'stockfish' | 'mirror' | 'personality';
    skillLevel: number;
};

export async function createAdminBot(token: string, data: CreateBotData) {
    const res = await fetch(`${API_URL}/admin/bots`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

export type AdminBot = {
    id: string;
    isBot: true;
    botType: 'stockfish' | 'mirror' | 'personality';
    name: string;
    description?: string;
    avatarURL?: string;
    avatarFrameURL?: string;
    userIcons?: { title: string; iconURL: string }[];
    profileBackground?: any;
    profileSong?: any;
    elo: number;
    engine: 'stockfish';
    skillLevel: number;
    pgnFiles: string[];
    status: 'idle' | 'searching' | 'playing' | 'disabled';
};

export async function getAdminBots(token: string): Promise<{ bots: AdminBot[] }> {
    const res = await fetch(`${API_URL}/admin/bots`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

export async function deleteAdminBot(token: string, id: string) {
    const res = await fetch(`${API_URL}/admin/bots/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

export async function disableAdminBot(token: string, id: string) {
    const res = await fetch(`${API_URL}/admin/bots/${id}/disable`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to disable bot');
    }

    return res.json();
}

export async function activateAdminBot(token: string, id: string) {
    const res = await fetch(`${API_URL}/admin/bots/${id}/activate`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to activate bot');
    }

    return res.json();
}