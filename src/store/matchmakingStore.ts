import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SearchStatus = {
    searching: boolean;
    eloRange: number | null;
    searchStartedAt?: string | null;
};

type MatchmakingStore = {
    isSearching: boolean;
    eloRange: number | null;
    searchStartedAt: number | null;
    isStartingSearch: boolean;
    revision: number;
    statusRevision: number;

    startSearch: () => void;
    finishStartingSearch: () => void;
    setSearchStatus: (status: SearchStatus) => void;
    setIsSearching: (value: boolean) => void;
    setEloRange: (value: number | null) => void;
    setSearchStartedAt: (value: number | null) => void;
    clearMatchmaking: () => void;
};

export const useMatchmakingStore = create<MatchmakingStore>()(
    persist(
        set => ({
            isSearching: false,
            eloRange: null,
            searchStartedAt: null,
            isStartingSearch: false,
            revision: 0,
            statusRevision: 0,

            startSearch: () => set(state => ({
                isSearching: true,
                isStartingSearch: true,
                searchStartedAt: Date.now(),
                revision: state.revision + 1,
            })),
            finishStartingSearch: () => set(state => ({
                isStartingSearch: false,
                revision: state.revision + 1,
            })),
            setSearchStatus: status => set(state => ({
                statusRevision: state.statusRevision + 1,
                isSearching: status.searching,
                eloRange: status.searching ? status.eloRange : null,
                searchStartedAt: status.searching
                    ? status.searchStartedAt
                        ? new Date(status.searchStartedAt).getTime()
                        : state.searchStartedAt
                    : null,
                revision: state.revision + 1,
            })),
            
            setIsSearching: (value) => set(state => ({ isSearching: value, revision: state.revision + 1 })),
            setEloRange: (value) => set(state => ({ eloRange: value, revision: state.revision + 1 })),
            setSearchStartedAt: (value) => set(state => ({ searchStartedAt: value, revision: state.revision + 1 })),
            clearMatchmaking: () => set(state => ({
                isSearching: false,
                eloRange: null,
                searchStartedAt: null,
                isStartingSearch: false,
                revision: state.revision + 1,
            }))
        }),
        {
            name: 'matchmakingTicket',
            partialize: state => ({
                isSearching: state.isSearching,
                eloRange: state.eloRange,
                searchStartedAt: state.searchStartedAt,
            }),
        }
    )
);
