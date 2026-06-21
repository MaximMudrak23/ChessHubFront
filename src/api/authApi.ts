import type { AuthResponse } from '@/types/user.types';
import { API_URL } from './config';

export async function login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

export async function register(
    email: string,
    password: string,
    key: string
): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, key }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

export async function me(token: string): Promise<Omit<AuthResponse, 'token'>> {
    const res = await fetch(`${API_URL}/auth/me`, {
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

export async function registerStart(email: string, password: string, key: string) {
    const res = await fetch(`${API_URL}/auth/register/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, key }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to start registration');
    }

    return res.json();
}

export async function getRegisterStatus(email: string) {
    const res = await fetch(
        `${API_URL}/auth/register/status?email=${encodeURIComponent(email)}`
    );

    if (!res.ok) {
        throw new Error('Failed to get register status');
    }

    return res.json();
}

export async function resendRegisterEmail(email: string) {
    const res = await fetch(`${API_URL}/auth/register/resend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to resend email');
    }

    return res.json();
}