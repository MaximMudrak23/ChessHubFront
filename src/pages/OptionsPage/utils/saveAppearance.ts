import { updateAppearance } from '@/api/userApi';
import { getSocketSessionVersion } from '@/socket/socket';
import { useUserStore } from '@/store/userStore';
import type { AppearanceSettings } from '@/types/user.types';

export async function saveAppearance(settings: AppearanceSettings) {
    const { user, token } = useUserStore.getState();
    if (!user || !token) throw new Error('Please sign in to save your appearance.');

    const session = getSocketSessionVersion();
    const isCurrentSession = () => {
        const current = useUserStore.getState();
        return current.user?.id === user.id && current.token === token && getSocketSessionVersion() === session;
    };

    try {
        const response = await updateAppearance(token, settings);
        if (!isCurrentSession()) return false;

        useUserStore.getState().setUser(response.user);
        useUserStore.getState().setBackgroundOverride(null);
        return true;
    } catch (error) {
        if (!isCurrentSession()) return false;

        useUserStore.getState().setBackgroundOverride(null);
        throw error;
    }
}
