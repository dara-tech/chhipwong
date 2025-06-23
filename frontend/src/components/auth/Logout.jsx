import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Logout = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await handleLogout();
      // Optional: Add a small delay before redirecting to ensure logout completes
      setTimeout(() => {
        navigate('/login');
      }, 100);
    };

    performLogout();
  }, [handleLogout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;
