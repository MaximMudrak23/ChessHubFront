import s from './styles.module.scss'
import UserAvatar from '@/components/User/UserAvatar'
import Button from '@/components/UI/Button'
import FrameCard from '@/components/FrameCard';
import { updateAvatar } from '@/api/userApi';
import { useUserStore } from '@/store/userStore';
import { useState, useEffect } from 'react';

export default function AvatarOption() {
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const setUser = useUserStore(s => s.setUser);

    const [avatarFile, setAvatarFile] = useState<File | undefined>();
    const [previewAvatarURL, setPreviewAvatarURL] = useState('');
    const [previewFrameURL, setPreviewFrameURL] = useState('');

    useEffect(() => {
        if (!user) return;

        setPreviewAvatarURL(user.avatarURL || '');
        setPreviewFrameURL(user.avatarFrameURL || '');
    }, [user]);

    if (!user || !token) return null;

    const availableFrames = user.unlockedFrames || [];

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setAvatarFile(file);
        setPreviewAvatarURL(URL.createObjectURL(file));
    }

    const handleSave = async () => {
        const data = await updateAvatar(token, {
            avatarFile,
            avatarFrameURL: previewFrameURL,
        });

        setUser(data.user);
        setAvatarFile(undefined);
    }

    const handleCancel = () => {
        setAvatarFile(undefined);
        setPreviewAvatarURL(user.avatarURL || '');
        setPreviewFrameURL(user.avatarFrameURL || '');
    }
    
    return (
        <>
            <div className={s.upload_avatar_container}>
                <div className={s.preview_container}>
                    <UserAvatar
                        userName={`${user.name} Preview`}
                        size={200}
                        imgURL={previewAvatarURL}
                        frameURL={previewFrameURL}
                    />
                </div>
                <div className={s.action_buttons_container}>
                    <input
                        id="avatarUpload"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                    />

                    <Button
                        text="Upload Avatar"
                        variant="profile"
                        animation="white-hover"
                        onClick={() => document.getElementById('avatarUpload')?.click()}
                        styleProps={{flex: 1, height: 65}}
                    />
                    <Button
                        text="No Frame"
                        variant="profile"
                        animation="white-hover"
                        onClick={() => setPreviewFrameURL('')}
                        styleProps={{flex: 1, height: 65}}
                    />
                </div>
            </div>
            <div className={s.user_unlocked_frames}>
                {availableFrames.map(frameURL => (
                    <FrameCard
                        key={frameURL}
                        frameURL={frameURL}
                        variant="profile"
                        isActive={previewFrameURL === frameURL}
                        onClick={() => setPreviewFrameURL(frameURL)}
                    />
                ))}
            </div>
            <div className={s.buttons_container}>
                <Button
                    text='Save'
                    variant='profile'
                    animation='white-hover'
                    onClick={handleSave}
                    styleProps={{flex: '1'}}
                />
                <Button
                    text='Cancel'
                    variant='profile'
                    animation='white-hover'
                    onClick={handleCancel}
                    styleProps={{flex: '1'}}
                />
            </div>
        </>
    )
}