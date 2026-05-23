import { useEffect } from 'react';
import { me } from '@/api/authApi';
import { useUserStore } from '@/store/userStore';

export default function AuthLoader() {
    const setAuth = useUserStore(s => s.setAuth);
    const finishLoading = useUserStore(s => s.finishLoading);

    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem('token');
            
            if (!token) {
                finishLoading();
                return;
            }

            try {
                const data = await me(token);
                setAuth(data.user, token);
            } catch {
                localStorage.removeItem('token');
            } finally {
                finishLoading();
            }
        }

        loadUser();
    }, [setAuth, finishLoading]);

    return null;
}