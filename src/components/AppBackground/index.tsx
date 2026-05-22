import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function AppBackground() {
    const user = useUserStore(s => s.user);

    useEffect(() => {
        const bg = user?.menuBackground || 'default';

        document.documentElement.style.setProperty(
            '--main-background',
            `url('/backgrounds/${bg}')`
        );
    }, [user?.menuBackground]);

    return null;
}