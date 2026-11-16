import { io } from 'socket.io-client';
import { API_URL } from '@/api/config';
import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';
import { useMatchmakingStore } from '@/store/matchmakingStore';

export const socket = io(API_URL, {
    autoConnect: false,
});

let sessionVersion = 0;

export function getSocketSessionVersion() {
    return sessionVersion;
}

function updateSession() {
    const { token, user } = useUserStore.getState();
    sessionVersion += 1;
    socket.disconnect();
    // Buffered packets belong to the previous authenticated session.
    socket.sendBuffer = [];
    socket.receiveBuffer = [];
    socket.auth = token ? { token } : {};

    if (token && user) socket.connect();
}

useUserStore.subscribe((state, previous) => {
    if (state.token === previous.token && state.user?.id === previous.user?.id) return;

    useGameStore.getState().clearGame();
    if (state.user?.id !== previous.user?.id) {
        useMatchmakingStore.getState().clearMatchmaking();
    }
    updateSession();
});

function requireLogin() {
    socket.disconnect();
    localStorage.removeItem('token');
    useGameStore.getState().clearGame();
    useMatchmakingStore.getState().clearMatchmaking();
    useUserStore.getState().logout();
}

socket.on('connect_error', error => {
    if (error.message === 'Unauthorized') requireLogin();
});

socket.on('disconnect', reason => {
    if (reason === 'io server disconnect' && useUserStore.getState().token) {
        requireLogin();
    }
});

// Also covers importing this module after authentication has already completed.
updateSession();
