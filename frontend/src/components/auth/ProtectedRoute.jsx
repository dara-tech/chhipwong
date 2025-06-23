import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles }) => {
  const { profile, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userHasRequiredRole = profile && allowedRoles?.includes(profile.type);
  
  if (!userHasRequiredRole) {
    // User is authenticated but does not have the required role, redirect to home.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
