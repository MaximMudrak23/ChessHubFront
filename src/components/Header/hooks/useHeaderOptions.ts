import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { SVG } from "@/constants/paths";

export function useHeaderOptions() {
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
            onClick: () => navigate('/profile/zxc'),
        },
        {
            img: SVG.searchIcon,
            text: 'Search',
            onClick: () => navigate('/search'),
        },
        {
            img: SVG.logoutIcon,
            text: 'Logout',
            onClick: () => {console.log('logout'); navigate('/')}
        },
    ], [navigate]);

    return options;
}