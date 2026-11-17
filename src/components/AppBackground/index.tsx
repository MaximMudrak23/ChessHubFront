import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { getMenuBackground } from '@/utils/getMenuBackground';

export default function AppBackground() {
    const user = useUserStore(s => s.user);
    const backgroundOverride = useUserStore(s => s.backgroundOverride);

    useEffect(() => {
        const background = getMenuBackground(backgroundOverride ?? user?.menuBackground);

        document.documentElement.style.setProperty(
            '--main-background',
            `url('${background.url}')`
        );
    }, [user?.menuBackground, backgroundOverride]);

    return null;
}
