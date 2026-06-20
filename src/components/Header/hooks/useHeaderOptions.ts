import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useUserStore } from '@/store/userStore'
import { useGameStore } from '@/store/gameStore'
import { useMatchmakingStore } from '@/store/matchmakingStore'
import { cancelSearch } from '@/api/gameApi';
import { SVG } from "@/constants/paths";

export function useHeaderOptions() {
    const navigate = useNavigate();
    
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const isSearching = useMatchmakingStore(s => s.isSearching);

    const logout = useUserStore(s => s.logout);
    const clearGame = useGameStore(s => s.clearGame);
    const clearMatchmaking = useMatchmakingStore(s => s.clearMatchmaking);

    const options = useMemo(() => {
        const baseOptions = [
            {
                img: SVG.menuIcon,
                text: 'Main',
                onClick: () => navigate('/main'),
            },
            {
                img: SVG.profileIcon,
                text: 'Profile',
                onClick: () => {
                    if (!user) {
                        alert('I Can`t find your profile!');
                        return;
                    }

                    navigate(`/profile/${user.id}`);
                },
            },
            {
                img: SVG.searchIcon,
                text: 'Search',
                onClick: () => navigate('/search'),
            },
        ];

        if (user?.role === 'admin') {
            baseOptions.push({
                img: SVG.adminIcon,
                text: 'Admin',
                onClick: () => navigate('/admin'),
            });
        }

        baseOptions.push({
            img: SVG.logoutIcon,
            text: 'Logout',
            onClick: async () => {
                try {
                    if (token && isSearching) {
                        await cancelSearch(token);
                    }
                } catch (error) {
                    console.log(error);
                }

                logout();
                clearGame();
                clearMatchmaking();

                localStorage.removeItem('token');
                navigate('/');
            },
        });

        return baseOptions;
    }, [navigate, user, token, isSearching, logout, clearGame, clearMatchmaking]);

    return options;
}