export type YouTubePlayer = {
    playVideo: () => void;
    pauseVideo: () => void;
    mute: () => void;
    unMute: () => void;
    isMuted: () => boolean;
    setVolume: (volume: number) => void;
    getVolume: () => number;
    getCurrentTime: () => number;
    getDuration: () => number;
    getPlayerState: () => number;
    getIframe: () => HTMLIFrameElement;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    getOptions: () => string[];
    loadModule: (module: 'captions') => void;
    unloadModule: (module: 'captions') => void;
    destroy: () => void;
};

type PlayerEvent = { target: YouTubePlayer };

type PlayerOptions = {
    videoId: string;
    width: string;
    height: string;
    playerVars: Record<string, string | number>;
    events: {
        onReady: (event: PlayerEvent) => void;
        onStateChange: (event: PlayerEvent & { data: number }) => void;
        onError: (event: PlayerEvent & { data: number }) => void;
        onAutoplayBlocked: (event: PlayerEvent) => void;
        onApiChange?: (event: PlayerEvent) => void;
    };
};

type YouTubeApi = {
    Player: new (element: HTMLElement, options: PlayerOptions) => YouTubePlayer;
};

declare global {
    interface Window {
        YT?: YouTubeApi;
        onYouTubeIframeAPIReady?: () => void;
    }
}

let apiPromise: Promise<YouTubeApi> | undefined;

export function loadYouTubeApi(): Promise<YouTubeApi> {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;

    apiPromise = new Promise((resolve, reject) => {
        const previousReady = window.onYouTubeIframeAPIReady;
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;

        function cleanup() {
            window.clearTimeout(timeout);
            script.onerror = null;
            if (window.onYouTubeIframeAPIReady === onReady) {
                window.onYouTubeIframeAPIReady = previousReady;
            }
        }

        function fail() {
            cleanup();
            script.remove();
            apiPromise = undefined;
            reject(new Error('YouTube player could not load'));
        }

        function onReady() {
            cleanup();
            if (window.YT?.Player) resolve(window.YT);
            else fail();
            previousReady?.();
        }

        const timeout = window.setTimeout(fail, 15_000);
        script.onerror = fail;
        window.onYouTubeIframeAPIReady = onReady;
        document.head.append(script);
    });

    return apiPromise;
}
