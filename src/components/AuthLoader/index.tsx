import { useEffect } from 'react';
import { me } from '@/api/authApi';
import { useUserStore } from '@/store/userStore';

export default function AuthLoader() {
    const setAuth = useUserStore(s => s.setAuth);

    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const data = await me(token);
                setAuth(data.user, token);
            } catch {
                localStorage.removeItem('token');
            }
        }

        loadUser();
    }, [setAuth]);

    return null;
}