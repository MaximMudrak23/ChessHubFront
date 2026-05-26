import type { User } from '@/types/user.types';
import { API_URL } from './config';

type SearchUsersResponse = {
    users: User[];
    totalPages: number;
};

export async function searchPlayers(token: string, q: string, page: number, limit: number = 10): Promise<SearchUsersResponse> {
    const res = await fetch(
        `${API_URL}/players/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

type GetUserByIdResponse = {
    user: User;
};

export async function getPlayerById(token: string, id: string): Promise<GetUserByIdResponse> {
    const res = await fetch(`${API_URL}/players/profile/${id}`, {
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