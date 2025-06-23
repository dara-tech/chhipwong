import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUserCircle, FaBuilding, FaChevronDown, FaMoneyBillWave, FaUserTie, FaUserFriends } from 'react-icons/fa';
import { MdOutlineHome, MdHome, MdOutlineMail, MdMail, MdPrivacyTip, MdOutlineDescription } from 'react-icons/md';
import { IoInformationCircleOutline, IoInformationCircle } from 'react-icons/io5';
import { RiDashboardLine, RiDashboardFill } from 'react-icons/ri';
import { BsPersonGear } from 'react-icons/bs';
import { HiOutlineLogout, HiOutlineUser, HiOutlineCog } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useCompanies from '../../hooks/useCompanies';
import LanguageSwitcher from './LanguageSwitcher';
import toast from 'react-hot-toast';

const Sidebar = ({ onCollapse }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, logout, getAdminProfile, loading: profileLoading } = useAuth();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAboutSubMenuOpen, setIsAboutSubMenuOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const aboutSubMenuRef = useRef(null);

  useEffect(() => {
    try {
      const role = profile?.type || null;
      setUserRole(role);
    } catch (error) {
      console.error('Error setting user role:', error);
    }
  }, [profile]);

  useEffect(() => {
    try {
      getCompanies();
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        getAdminProfile();
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  }, [getAdminProfile]);

  useEffect(() => {
    try {
      if (companies && companies.length > 0) {
        setCurrentCompany(companies[0]);
      }
    } catch (error) {
      console.error('Error setting current company:', error);
    }
  }, [companies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (aboutSubMenuRef.current && !aboutSubMenuRef.current.contains(event.target)) {
        setIsAboutSubMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse?.(newState);
  };
  
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsAboutSubMenuOpen(false);
  };

  const toggleAboutSubMenu = (e) => {
    e.stopPropagation();
    setIsAboutSubMenuOpen(!isAboutSubMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsProfileMenuOpen(false);
      
      // Show loading toast
      const loadingToast = toast.loading(t('loggingOut'));
      
      // Perform logout
      await logout();
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(t('loggedOut'));
      
      // Clear any stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(t('logoutError'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const publicLinks = [
    { to: '/', label: t('home'), icon: <MdOutlineHome />, activeIcon: <MdHome /> },
    {
      label: t('about'),
      icon: <IoInformationCircleOutline />,
      activeIcon: <IoInformationCircle />,
      isDropdown: true,
      subMenu: [
        { to: '/about', label: t('about'), icon: <IoInformationCircleOutline />, activeIcon: <IoInformationCircle /> },
        { to: '/professional', label: t('professional'), icon: <FaUserTie />, activeIcon: <FaUserTie /> },
        { to: '/faq', label: t('faq'), icon: <MdOutlineDescription />, activeIcon: <MdOutlineDescription /> },
        { to: '/privacy-policy', label: t('privacy-policy'), icon: <MdPrivacyTip />, activeIcon: <MdPrivacyTip /> },
        { to: '/terms-conditions', label: t('terms-conditions'), icon: <MdOutlineDescription />, activeIcon: <MdOutlineDescription /> },
      ]
    },
    { to: '/contact', label: t('contact'), icon: <MdOutlineMail />, activeIcon: <MdMail /> },
  ];

  const commonLinks = {
    payments: { 
      to: '/payments', 
      label: t('paymentViewer.title'), 
      icon: <FaMoneyBillWave />, 
      activeIcon: <FaMoneyBillWave /> 
    },
    profile: { 
      to: '/profile', 
      label: t('Profile'), 
      icon: <BsPersonGear />, 
      activeIcon: <BsPersonGear /> 
    },
  };

  const linksForAuthenticatedUser = [
    { to: '/dashboard', label: t('dashboard'), icon: <RiDashboardLine />, activeIcon: <RiDashboardFill /> },
    commonLinks.payments,
    { 
      to: companies && companies.length === 1 ? `/companies/${companies[0]._id}` : '/companies',
      label: t('companies'), 
      icon: <FaBuilding />, 
      activeIcon: <FaBuilding /> 
    },
    { to: '/users', label: t('users'), icon: <FaUserFriends />, activeIcon: <FaUserFriends /> },
    // { to: '/admin/settings', label: t('admin.settings'), icon: <HiOutlineCog />, activeIcon: <HiOutlineCog /> },
    commonLinks.profile,
  ];

  const activeLinks = profile ? linksForAuthenticatedUser : publicLinks;

  return (
    <div className={`fixed top-0 left-0 h-screen bg-base-100 border-r border-base-300/20 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Company Logo and Name */}
      <div className="h-20 flex items-center px-4 border-b border-base-300/20">
        {/* <Link to="/" className="flex items-center gap-3">
          <div className="relative">
            {companiesLoading ? (
              <div className="w-10 h-10 rounded-xl bg-base-300/50" />
            ) : currentCompany?.logo ? (
              <img
                className="w-10 h-10 rounded-xl object-cover"
                src={currentCompany.logo}
                alt={currentCompany.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-company-logo.png';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-white shadow-lg">
                {currentCompany?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {companiesLoading ? (
                <div className="h-7 w-32 rounded bg-base-300/50" />
              ) : (
                currentCompany?.name || t('appName')
              )}
            </span>
          )}
        </Link> */}
      </div>

      {/* Navigation Links */}
      <div className="py-4 px-4 justify-start flex flex-col ">
        {activeLinks.map(link => {
          if (link.isDropdown) {
            const isDropdownActive = link.subMenu && link.subMenu.some(subLink => location.pathname.startsWith(subLink.to));
            return (
              <div key={link.label} className="relative" ref={aboutSubMenuRef}>
                <button
                  onClick={toggleAboutSubMenu}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${
                    isDropdownActive
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary'
                      : 'hover:bg-base-200/80'
                  }`}
                >
                  <span className={`text-lg ${isDropdownActive ? 'text-primary' : ''}`}>
                    {isDropdownActive ? link.activeIcon : link.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{link.label}</span>
                      <FaChevronDown className={`w-3 h-3 ${isAboutSubMenuOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                {isAboutSubMenuOpen && !isCollapsed && (
                  <div className="mt-1 ml-4 space-y-1">
                    {link.subMenu.map(subLink => {
                      const isSubActive = location.pathname.startsWith(subLink.to);
                      return (
                        <Link
                          key={subLink.to}
                          to={subLink.to}
                          onClick={() => setIsAboutSubMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                            isSubActive 
                              ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary' 
                              : 'text-base-content/80 hover:bg-base-200/80'
                          }`}
                        >
                          <span className="text-lg">{isSubActive ? subLink.activeIcon : subLink.icon}</span>
                          {subLink.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary'
                    : 'hover:bg-base-200/80'
                }`}
              >
                <span className={`text-lg ${isActive ? 'text-primary' : ''}`}>
                  {isActive ? link.activeIcon : link.icon}
                </span>
                {!isCollapsed && <span>{link.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-base-100 rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          }
        })}
      </div>

      {/* Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300/20">
        {profileLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-base-300/50 animate-pulse" />
            {!isCollapsed && <div className="h-5 w-32 bg-base-300/50 rounded animate-pulse" />}
          </div>
        ) : profile ? (
          <div className="relative" ref={profileMenuRef}>
            <div className="w-full flex items-center gap-3 px-3 py-2 rounded-xl">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt={profile.name || 'Profile'}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <FaUserCircle className="w-6 h-6 text-primary" />
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile.name || 'User'}</p>
                  <p className="text-xs text-base-content/60 truncate capitalize">{profile.type?.replace('_', ' ') || 'User'}</p>
                </div>
              )}
            </div>
            {/* Always visible logout button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-error text-white hover:bg-error/90 transition-colors shadow ${
                isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <HiOutlineLogout className={`w-5 h-5 ${isLoggingOut ? 'animate-spin' : ''}`} />
              {!isCollapsed && (isLoggingOut ? t('loggingOut') : t('logout'))}
            </button>
            {/* Dropdown remains for profile details if needed */}
            {isProfileMenuOpen && !isCollapsed && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl shadow-xl bg-base-100/95 backdrop-blur-xl border border-base-300/20">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt={profile.name || 'Profile'}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <FaUserCircle className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold truncate bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {profile.name || 'User'}
                      </p>
                      <p className="text-sm text-base-content/60 truncate mt-0.5">
                        {profile.email || 'No email'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-base-200/80 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <HiOutlineUser className="w-5 h-5" />
                    {t('profile')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/20 transition-all"
          >
            <HiOutlineUser className="w-5 h-5" />
            {!isCollapsed && t('login')}
          </Link>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-base-100 border border-base-300/20 flex items-center justify-center hover:bg-base-200/80 transition-colors"
      >
        <FaChevronDown className={`w-3 h-3 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export default Sidebar; 