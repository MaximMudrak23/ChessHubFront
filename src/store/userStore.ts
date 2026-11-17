import { create } from "zustand";
import type { User } from "@/types/user.types";
import type { BACKGROUNDS } from '@/constants/paths';

type UserStore = {
    user: User | null;
    token: string | null;
    isAuth: boolean;
    isLoading: boolean;
    backgroundOverride: keyof typeof BACKGROUNDS | null;

    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void;
    setBackgroundOverride: (background: keyof typeof BACKGROUNDS | null) => void;
    finishLoading: () => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>(set => ({
    user: null,
    token: null,
    isAuth: false,
    isLoading: true,
    backgroundOverride: null,

    setAuth: (user, token) => set({
        user,
        token,
        isAuth: true,
        backgroundOverride: null,
    }),

    setUser: (user) => set({user}),
    setBackgroundOverride: backgroundOverride => set({backgroundOverride}),

    finishLoading: () => set({
        isLoading: false,
    }),

    logout: () => set({
        user: null,
        token: null,
        isAuth: false,
        isLoading: false,
        backgroundOverride: null,
    }),
}));
