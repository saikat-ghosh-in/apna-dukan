import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, roles = [] }) => {
    const { user } = useSelector((state) => state.auth);
    const userDetails = useSelector((state) => state.auth?.userDetails);
    const location = useLocation();

    if (publicPage) {
        return user ? <Navigate to="/" /> : <Outlet />;
    }

    if (!user) {
        const redirect = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirect=${redirect}`} replace />;
    }

    if (roles.length > 0) {
        const userRoles = userDetails?.roles ?? [];
        const hasRole = roles.some(r => userRoles.includes(r));
        if (!hasRole) return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute;