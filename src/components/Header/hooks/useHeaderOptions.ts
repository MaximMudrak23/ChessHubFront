import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { SVG } from "@/constants/paths";
import { useUserStore } from '@/store/userStore'

export function useHeaderOptions() {
    const user = useUserStore(s => s.user);
    const logout = useUserStore(s => s.logout);
    const navigate = useNavigate();

    const options = useMemo(() => [
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
                navigate(`/profile/${user?.id}`);
            },
        },
        {
            img: SVG.searchIcon,
            text: 'Search',
            onClick: () => navigate('/search'),
        },
        {
            img: SVG.logoutIcon,
            text: 'Logout',
            onClick: () => {
                logout();
                localStorage.removeItem('token');
                navigate('/');
            },
        },
    ], [navigate, user, logout]);

    return options;
}