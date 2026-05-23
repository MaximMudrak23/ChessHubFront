import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MatchmakingStore = {
    isSearching: boolean;
    eloRange: number | null;
    searchStartedAt: number | null;

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
            
            setIsSearching: (value) => set({ isSearching: value }),
            setEloRange: (value) => set({ eloRange: value }),
            setSearchStartedAt: (value) => set({ searchStartedAt: value }),
            clearMatchmaking: () => set({
                isSearching: false,
                eloRange: null,
                searchStartedAt: null,
            })
        }),
        { name: 'matchmakingTicket', }
    )
);