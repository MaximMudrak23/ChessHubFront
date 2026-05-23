import { create } from "zustand";
import type { User } from "@/types/user.types";

type UserStore = {
    user: User | null;
    token: string | null;
    isAuth: boolean;
    isLoading: boolean;

    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void;
    finishLoading: () => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>(set => ({
    user: null,
    token: null,
    isAuth: false,
    isLoading: true,

    setAuth: (user, token) => set({
        user,
        token,
        isAuth: true,
    }),

    setUser: (user) => set({user}),

    finishLoading: () => set({
        isLoading: false,
    }),

    logout: () => set({
        user: null,
        token: null,
        isAuth: false,
        isLoading: false,
    }),
}));