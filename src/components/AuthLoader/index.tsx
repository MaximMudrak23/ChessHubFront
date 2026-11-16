import { useEffect } from 'react';
import { me } from '@/api/authApi';
import { useUserStore } from '@/store/userStore';
import { getSocketSessionVersion } from '@/socket/socket';

export default function AuthLoader() {
    const setAuth = useUserStore(s => s.setAuth);
    const finishLoading = useUserStore(s => s.finishLoading);

    useEffect(() => {
        let active = true;
        const session = getSocketSessionVersion();
        async function loadUser() {
            const token = localStorage.getItem('token');
            
            if (!token) {
                finishLoading();
                return;
            }

            try {
                const data = await me(token);
                if (active && session === getSocketSessionVersion() && localStorage.getItem('token') === token) {
                    setAuth(data.user, token);
                }
            } catch {
                if (active && session === getSocketSessionVersion() && localStorage.getItem('token') === token) {
                    localStorage.removeItem('token');
                }
            } finally {
                if (active) finishLoading();
            }
        }

        loadUser();
        return () => { active = false; };
    }, [setAuth, finishLoading]);

    return null;
}
