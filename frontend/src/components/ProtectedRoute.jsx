import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
    const location = useLocation();
    const token = localStorage.getItem('access');
    const userStr = localStorage.getItem('user');

    if (!token) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch {
        user = null;
    }

    const role = user?.role || 'patient';
    const isAdmin = role === 'admin' || user?.is_admin;
    const isDoctor = role === 'doctor' || role === 'hospital_staff';

    if (allowedRoles && allowedRoles.length > 0) {
        const isAllowed = allowedRoles.some((r) => {
            if (r === 'admin') return isAdmin;
            if (r === 'doctor' || r === 'hospital_staff') return isDoctor;
            if (r === 'patient') return role === 'patient';
            return r === role;
        });

        if (!isAllowed) {
            if (isDoctor) {
                return <Navigate to='/doctor/dashboard' replace />;
            } else if (isAdmin) {
                return <Navigate to='/hospital/dashboard' replace />;
            } else {
                return <Navigate to='/patient/dashboard' replace />;
            }
        }
    }

    return children;
}

export default ProtectedRoute;
