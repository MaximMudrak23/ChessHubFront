import { create } from "zustand";
import type { User } from "@/types/user.types";

type UserStore = {
    user: User | null;
    token: string | null;
    isAuth: boolean;

    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>(set => ({
    user: null,
    token: null,
    isAuth: false,

    setAuth: (user, token) => set({
        user,
        token,
        isAuth: true,
    }),

    setUser: (user) => set({user}),

    logout: () => set({
        user: null,
        token: null,
        isAuth: false,
    }),
}));