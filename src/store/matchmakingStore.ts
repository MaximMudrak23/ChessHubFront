import { create } from 'zustand';

type MatchmakingStore = {
    isSearching: boolean;
    eloRange: number | null;
    setIsSearching: (value: boolean) => void;
    setEloRange: (value: number | null) => void;
};

export const useMatchmakingStore = create<MatchmakingStore>((set) => ({
    isSearching: false,
    eloRange: null,

    setIsSearching: (value) => set({ isSearching: value }),
    setEloRange: (value) => set({ eloRange: value }),
}));