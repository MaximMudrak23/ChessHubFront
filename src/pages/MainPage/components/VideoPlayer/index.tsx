import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { loadYouTubeApi, type YouTubePlayer } from './youtubeApi';
import s from './styles.module.scss';

type Props = {
    videoId: string;
    title: string;
    className?: string;
};

export default function VideoPlayer({ videoId, title, className }: Props) {
    const screenRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState('Loading video…');
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const screen = screenRef.current;
        if (!screen) return;
        let disposed = false;
        let unavailable = false;
        let started = false;
        let player: YouTubePlayer | undefined;
        // YouTube replaces this node. Keep its parent under React's ownership.
        const mount = document.createElement('div');
        screen.append(mount);

        function fail(message: string) {
            if (disposed || unavailable) return;
            unavailable = true;
            window.clearTimeout(readyTimeout);
            setFailed(true);
            setMessage(message);
        }

        const readyTimeout = window.setTimeout(() => fail('Could not connect to YouTube.'), 20_000);

        loadYouTubeApi().then(api => {
            if (disposed || unavailable) return;
            player = new api.Player(mount, {
                videoId,
                width: '100%',
                height: '100%',
                playerVars: {
                    autoplay: 0, controls: 1, playsinline: 1, cc_load_policy: 0,
                    loop: 1, playlist: videoId, rel: 0,
                    origin: window.location.origin,
                },
                events: {
                    onReady: ({ target }) => {
                        if (disposed || unavailable) return;
                        window.clearTimeout(readyTimeout);
                        target.getIframe().title = title;
                        target.unloadModule('captions');
                        target.mute();
                        target.setVolume(50);
                        setMessage('');
                        target.playVideo();
                    },
                    onStateChange: ({ target, data }) => {
                        if (disposed || unavailable || data !== 1) return;
                        // Disable initial captions without overriding the native CC button later.
                        if (!started) target.unloadModule('captions');
                        started = true;
                        setMessage('');
                    },
                    onAutoplayBlocked: () => {
                        if (!disposed && !unavailable) setMessage('Press Play to start the video.');
                    },
                    onError: () => {
                        fail('This video cannot be played here.');
                    },
                },
            });
        }).catch(() => {
            fail('Could not connect to YouTube.');
        });

        return () => {
            disposed = true;
            window.clearTimeout(readyTimeout);
            player?.destroy();
            screen.replaceChildren();
        };
    }, [videoId, title]);

    return (
        <div className={clsx(s.player, className)} role='region' aria-label={`${title} player`}>
            <div className={s.screen} ref={screenRef} />
            {message && (
                <p className={s.message} role='status'>
                    {message}{' '}
                    {failed && <a href={`https://www.youtube.com/watch?v=${videoId}`} target='_blank' rel='noreferrer'>Watch on YouTube</a>}
                </p>
            )}
        </div>
    );
}
