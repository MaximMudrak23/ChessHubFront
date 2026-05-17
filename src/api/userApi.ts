import type { AuthResponse } from '@/types/user.types';
import { API_URL } from './config';

type UpdateProfileData = {
    name?: string;
    description?: string;
};

export async function updateProfile(token: string, data: UpdateProfileData): Promise<Omit<AuthResponse, 'token'>> {
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

type UpdateAvatarData = {
    avatarFile?: File;
    avatarFrameURL?: string;
};

export async function updateAvatar(token: string, data: UpdateAvatarData): Promise<Omit<AuthResponse, 'token'>> {
    const formData = new FormData();

    if (data.avatarFile) {
        formData.append('avatar', data.avatarFile);
    }

    if (data.avatarFrameURL !== undefined) {
        formData.append('avatarFrameURL', data.avatarFrameURL);
    }

    const res = await fetch(`${API_URL}/users/avatar`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}