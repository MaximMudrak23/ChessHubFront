import ProfilePlate from '../ProfilePlate'
import { getFileURL } from '@/utils/getFileURL'
import { useRef, useState } from 'react'
import type { ProfileSong } from '@/types/user.types'
import { SVG } from '@/constants/paths'

type Props = {
    song: ProfileSong;
}

export default function ProfileSongPlate({ song }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleClick = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.75;

        if (audio.paused) {
            try {
                await audio.play();
            } catch {
                setIsPlaying(false);
            }
        } else {
            audio.pause();
        }
    }

    return (
        <>
            <audio
                ref={audioRef}
                src={getFileURL(song.songURL)}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            />

            <ProfilePlate
                isSong
                text={`${song.songName} • ${song.songAuthor}`}
                imgURL={getFileURL(song.songAvatarURL)}
                onClick={handleClick}
                songActionIcon={isPlaying ? SVG.profilePause : SVG.profilePlay}
            />
        </>
    )
}