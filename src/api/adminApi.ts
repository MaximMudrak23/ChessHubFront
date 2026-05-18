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