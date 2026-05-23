import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'

export default function AdminRoute() {
    const user = useUserStore(s => s.user);
    const isLoading = useUserStore(s => s.isLoading);

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/main" replace />;
    }

    return <Outlet />;
}