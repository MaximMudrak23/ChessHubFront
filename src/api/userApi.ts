import type { AuthResponse } from '@/types/user.types';
import { API_URL } from './config';

type UpdateProfileData = {
    name?: string;
    description?: string;
};

export async function updateProfile( token: string, data: UpdateProfileData): Promise<Omit<AuthResponse, 'token'>> {
    const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
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