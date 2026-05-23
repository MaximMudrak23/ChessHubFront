import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'

export default function ProtectedRoute() {
    const isAuth = useUserStore(s => s.isAuth);
    const isLoading = useUserStore(s => s.isLoading);

    if (isLoading) {
        return null;
    }

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}