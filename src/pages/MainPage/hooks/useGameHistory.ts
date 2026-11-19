import { useEffect, useState } from 'react';
import { getGameHistory } from '@/api/gameApi';
import { getSocketSessionVersion } from '@/socket/socket';
import { useUserStore } from '@/store/userStore';
import { mapGameHistoryEntry } from '@/utils/mapGameHistoryEntry';
import type { GameHistoryPagination } from '@/types/gameHistory.types';
import type { GameHistoryEntry } from '../components/GameHistory/types';

type HistoryState = {
    session: number;
    requestVersion: number;
    games?: GameHistoryEntry[];
    pagination?: GameHistoryPagination;
    error: string | null;
};

export function useGameHistory() {
    const token = useUserStore(state => state.token);
    const userId = useUserStore(state => state.user?.id);
    const session = getSocketSessionVersion();
    const [request, setRequest] = useState({ session, page: 1, version: 0 });
    const [history, setHistory] = useState<HistoryState | null>(null);
    const page = request.session === session ? request.page : 1;
    const requestVersion = request.version;
    const authorized = Boolean(token && userId);

    // Hide the previous account's rows immediately, before effect cleanup runs.
    const current = authorized && history?.session === session ? history : null;
    const isLoading = authorized && current?.requestVersion !== requestVersion;
    const error = isLoading ? null : current?.error ?? null;

    useEffect(() => {
        if (!token || !userId) return;
        const authToken = token;
        const controller = new AbortController();
        const isCurrent = () => !controller.signal.aborted && session === getSocketSessionVersion();

        async function loadPage() {
            try {
                const data = await getGameHistory(authToken, page, 20, controller.signal);
                if (!isCurrent()) return;
                const entries = data.games.map(mapGameHistoryEntry);

                setHistory(previous => {
                    if (!isCurrent()) return previous;
                    const existing = page > 1 && previous?.session === session ? previous.games ?? [] : [];
                    const games = new Map(existing.map(game => [game.id, game]));
                    // Offset pagination may repeat a game when a newer match finishes.
                    for (const game of entries) {
                        if (!games.has(game.id)) games.set(game.id, game);
                    }
                    return {
                        session,
                        requestVersion,
                        games: [...games.values()],
                        pagination: data.pagination,
                        error: null,
                    };
                });
            } catch {
                if (!isCurrent()) return;
                setHistory(previous => {
                    if (!isCurrent()) return previous;
                    const existing = previous?.session === session ? previous : null;
                    return {
                        session,
                        requestVersion,
                        games: existing?.games,
                        pagination: existing?.pagination,
                        error: 'Could not load game history. Please try again.',
                    };
                });
            }
        }

        void loadPage();
        return () => controller.abort();
    }, [token, userId, session, page, requestVersion]);

    function loadMore() {
        if (isLoading || error || !current?.pagination?.hasMore) return;
        const nextPage = current.pagination.page + 1;
        setRequest(previous => ({ session, page: nextPage, version: previous.version + 1 }));
    }

    function retry() {
        if (isLoading || !authorized || !error) return;
        setRequest(previous => ({ session, page, version: previous.version + 1 }));
    }

    return {
        games: current?.games,
        isLoading,
        error,
        hasMore: current?.pagination?.hasMore ?? false,
        loadMore,
        retry,
    };
}
