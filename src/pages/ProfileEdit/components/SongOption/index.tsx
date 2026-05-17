import s from './styles.module.scss'
import Button from '@/components/UI/Button'
import SongCard from '@/components/SongCard'
import { useUserStore } from '@/store/userStore'
import { useEffect, useState } from 'react'
import { updateSong } from '@/api/userApi'
import type { ProfileSong } from '@/types/user.types'

export default function SongOption() {
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const setUser = useUserStore(s => s.setUser);

    const [previewSong, setPreviewSong] = useState<ProfileSong | null>(null);

    useEffect(() => {
        if (!user) return;

        setPreviewSong(user.profileSong || null);
    }, [user]);

    if (!user || !token) return null;

    const availableSongs = user.unlockedProfileSongs || [];

    const handleSave = async () => {
        const data = await updateSong(token, {
            profileSong: previewSong,
        });

        setUser(data.user);
    }

    const handleCancel = () => {
        setPreviewSong(user.profileSong || null);
    }

    return (
        <>
            <div className={s.songs_container}>
                {availableSongs.map(song => (
                    <SongCard
                        key={song.songURL}
                        songName={song.songName}
                        songAuthor={song.songAuthor}
                        songAvatarURL={song.songAvatarURL}
                        isActive={previewSong?.songURL === song.songURL}
                        onClick={() => setPreviewSong(song)}
                    />
                ))}
            </div>

            <div className={s.buttons_container}>
                <Button
                    text="No Song"
                    variant="profile"
                    animation="white-hover"
                    onClick={() => setPreviewSong(null)}
                    styleProps={{ flex: '1' }}
                />
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