import s from './styles.module.scss'
import Button from '@/components/UI/Button'
import BackgroundCard from '@/components/BackgroundCard'
import { useUserStore } from '@/store/userStore'
import { useState, useEffect } from 'react'
import { updateBackground } from '@/api/userApi'
import type { ProfileBackground } from '@/types/user.types'

export default function BackgroundOption() {
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const setUser = useUserStore(s => s.setUser);

    const [previewBackground, setPreviewBackground] = useState<ProfileBackground | null>(null);

    useEffect(() => {
        if (!user) return;

        setPreviewBackground(user.profileBackground || null);
    }, [user]);

    if (!user || !token) return null;

    const availableBackgrounds = user.unlockedProfileBackgrounds || [];

    const handleSave = async () => {
        const data = await updateBackground(token, {
            profileBackground: previewBackground,
        });

        setUser(data.user);
    }

    const handleCancel = () => {
        setPreviewBackground(user.profileBackground || null);
    }

    return (
        <>
            <div className={s.user_unlocked_backgrounds}>
                {availableBackgrounds.map(background => (
                    <BackgroundCard
                        key={background.url}
                        type={background.type}
                        url={background.url}
                        isActive={previewBackground?.url === background.url}
                        onClick={() => setPreviewBackground(background)}
                    />
                ))}
            </div>
            <div className={s.buttons_container}>
                <Button
                    text="No Background"
                    variant="profile"
                    animation="white-hover"
                    onClick={() => setPreviewBackground(null)}
                    styleProps={{ flex: '1' }}
                />
            </div>
            <div className={s.buttons_container}>
                <Button
                    text="Save"
                    variant="profile"
                    animation="white-hover"
                    onClick={handleSave}
                    styleProps={{ flex: '1' }}
                />

                <Button
                    text="Cancel"
                    variant="profile"
                    animation="white-hover"
                    onClick={handleCancel}
                    styleProps={{ flex: '1' }}
                />
            </div>
        </>
    )
}