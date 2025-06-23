import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../shares/Sidebar';
import Navbar from '../shares/Navbar';
import { sidebarRoutes } from '../shares/navigationConfig';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

function shouldShowSidebar(pathname, isSuperAdmin) {
  // Show sidebar by default for super admin users
  if (isSuperAdmin) {
    return true;
  }

  // Don't show sidebar for payment, user, and company routes
  const excludedRoutes = ['/payment', '/users', '/companies'];
  if (excludedRoutes.some(route => pathname.startsWith(route))) {
    return false;
  }

  // Only show sidebar for exact matches or direct children of sidebar routes
  return sidebarRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

const MainLayout = () => {
  const location = useLocation();
  const { profile, isAuthenticated } = useAuth();
  const isSuperAdmin = profile?.type === 'super_admin';
  // Only show sidebar if authenticated
  const showSidebar = isAuthenticated && shouldShowSidebar(location.pathname, isSuperAdmin);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Don't show navbar for super admin users
  const shouldShowNavbar = !isSuperAdmin;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      {showSidebar && !isMobile ? (
        <Sidebar onCollapse={setIsSidebarCollapsed} />
      ) : shouldShowNavbar ? (
        <Navbar />
      ) : null}
      <main 
        className={`transition-all duration-300 ${
          showSidebar && !isMobile
            ? isSidebarCollapsed 
              ? 'ml-20' 
              : 'ml-64'
            : ''
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 