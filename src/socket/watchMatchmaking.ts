import { findGame } from '@/api/gameApi';
import { useMatchmakingStore } from '@/store/matchmakingStore';
import { getSocketSessionVersion, socket } from './socket';
import { isObjectId } from './subscribeToSocketState';

export function watchMatchmaking(userId: string, token: string, onGameFound: (gameId: string, announce: boolean) => void) {
    if (!isObjectId(userId)) return;

    const session = getSocketSessionVersion();
    let active = true;
    let version = 0;
    let pending = false;
    let joined = false;
    let synchronized = true;
    let lastGameId: string | null = null;
    const isCurrent = () => active && session === getSocketSessionVersion();

    function found(gameId: string, announce: boolean) {
        if (!isCurrent() || !isObjectId(gameId) || lastGameId === gameId) return;
        lastGameId = gameId;
        useMatchmakingStore.getState().clearMatchmaking();
        onGameFound(gameId, announce);
    }

    function handleMatchFound(gameId: string) {
        found(gameId, true);
    }

    async function search() {
        if (!isCurrent() || !socket.connected || !joined || !synchronized || pending || !useMatchmakingStore.getState().isSearching) return;
        pending = true;
        const requestVersion = version;
        const revision = useMatchmakingStore.getState().revision;
        try {
            const data = await findGame(token);
            if (!isCurrent() || requestVersion !== version) return;
            if (revision !== useMatchmakingStore.getState().revision) return;

            if (data.status === 'searching') {
                useMatchmakingStore.getState().setEloRange(data.eloRange);
            } else if (data.status === 'matched' || data.status === 'in_game') {
                found(String(data.game._id), data.status === 'matched');
            }
        } catch (error) {
            if (!isCurrent() || requestVersion !== version) return;
            console.log(error);
            if (revision === useMatchmakingStore.getState().revision) {
                useMatchmakingStore.getState().clearMatchmaking();
            }
        } finally {
            if (isCurrent() && requestVersion === version) {
                pending = false;
                if (useMatchmakingStore.getState().isStartingSearch) {
                    useMatchmakingStore.getState().finishStartingSearch();
                }
            }
        }
    }

    function join() {
        if (!isCurrent() || !socket.connected || joined || !useMatchmakingStore.getState().isSearching) return;
        socket.emit('matchmaking:join', userId);
        joined = true;
        void search();
    }

    function leave() {
        if (joined && socket.connected && isCurrent()) socket.emit('matchmaking:leave', userId);
        joined = false;
        pending = false;
        version += 1;
    }

    function handleConnect() {
        leave();
        // Resume an existing search only after Header synchronizes the server status.
        // A new user-initiated search may start immediately after joining.
        synchronized = useMatchmakingStore.getState().isStartingSearch;
        join();
    }

    function handleDisconnect() {
        joined = false;
        pending = false;
        synchronized = false;
        version += 1;
    }

    // Install the listener and room subscription before the first HTTP search.
    socket.on('match:found', handleMatchFound);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    const unsubscribe = useMatchmakingStore.subscribe((state, previous) => {
        if (!isCurrent()) return;
        const wasSynchronized = synchronized;
        if (state.statusRevision !== previous.statusRevision || state.isStartingSearch) synchronized = true;
        if (state.isSearching !== previous.isSearching) {
            if (state.isSearching) join();
            else leave();
        }
        if (!wasSynchronized && synchronized && state.isSearching) void search();
    });
    if (socket.connected) join();
    const interval = setInterval(search, 3000);

    return () => {
        leave();
        active = false;
        unsubscribe();
        clearInterval(interval);
        socket.off('match:found', handleMatchFound);
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
    };
}
