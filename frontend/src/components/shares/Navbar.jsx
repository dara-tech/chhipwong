import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUserCircle, FaBuilding, FaChevronDown, FaMoneyBillWave, FaUserTie, FaUserFriends } from 'react-icons/fa';
import axios from 'axios';
import LanguageSwitcher from './LanguageSwitcher';
import { MdOutlineHome, MdHome, MdOutlineMail, MdMail, MdPrivacyTip, MdOutlineDescription } from 'react-icons/md';
import { IoInformationCircleOutline, IoInformationCircle } from 'react-icons/io5';
import { RiDashboardLine, RiDashboardFill } from 'react-icons/ri';
import { BsPersonGear } from 'react-icons/bs';
import { HiOutlineLogout, HiOutlineUser, HiOutlineCog } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useCompanies from '../../hooks/useCompanies';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile, logout, getAdminProfile, loading: profileLoading } = useAuth();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAboutSubMenuOpen, setIsAboutSubMenuOpen] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [language, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const aboutSubMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const role = profile?.type || null;
    setUserRole(role);
  }, [profile]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (aboutSubMenuRef.current && !aboutSubMenuRef.current.contains(event.target)) {
        setIsAboutSubMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (lng) => setCurrentLanguage(lng);
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) setCurrentLanguage(savedLanguage);
    if (!language) setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language, language]);

  useEffect(() => { getCompanies(); }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) getAdminProfile();
  }, [getAdminProfile]);

  useEffect(() => {
    if (companies && companies.length > 0) {
      setCurrentCompany(companies[0]);
    }
  }, [companies]);

  const isSuperAdminRoute = location.pathname.startsWith('/admin') && userRole === 'super_admin';
  if (isSuperAdminRoute) {
    return null;
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
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

  const toggleMobileSubMenu = (label) => {
    setOpenMobileSubMenu(openMobileSubMenu === label ? null : label);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
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

   // Define common link items to avoid repetition
   const commonLinks = useMemo(() => ({
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
    // You can add other common links here
  }), [t]); // Dependency `t` ensures labels are re-translated on language change

  // --- The Advanced Logic ---
  // Use useMemo to calculate links only when dependencies change
  const linksForAuthenticatedUser = useMemo(() => {
    // A declarative map for role-based links. Easier to read and scale.
    const roleConfig = {
      super_admin: [
        { to: '/dashboard', label: t('dashboard'), icon: <RiDashboardLine />, activeIcon: <RiDashboardFill /> },
        commonLinks.payments,
        () => ({ 
          to: currentCompany ? `/companies/${currentCompany._id}` : '/companies', 
          label: t('companies'), 
          icon: <FaBuilding />, 
          activeIcon: <FaBuilding /> 
        }),
        { to: '/users', label: t('users'), icon: <FaUserFriends />, activeIcon: <FaUserFriends /> },
        // { to: '/admin/settings', label: t('admin.settings'), icon: <HiOutlineCog />, activeIcon: <HiOutlineCog /> },
        commonLinks.profile,
      ],
      admin: [
        // { to: '/dashboard', label: t('dashboard'), icon: <RiDashboardLine />, activeIcon: <RiDashboardFill /> },
        commonLinks.payments,
        () => ({ 
          to: currentCompany ? `/companies/${currentCompany._id}` : '/companies', 
          label: t('companies'), 
          icon: <FaBuilding />, 
          activeIcon: <FaBuilding /> 
        }),
        { to: '/users', label: t('users'), icon: <FaUserFriends />, activeIcon: <FaUserFriends /> },
        commonLinks.profile,
      ],
      payment_viewer: [
        commonLinks.payments,
        commonLinks.profile,
      ],
      // Default for any other authenticated user
      default: [
        commonLinks.profile,
      ],
    };

    // Get the links for the current user's role, or fall back to the default.
    const links = roleConfig[userRole] || roleConfig.default;

    // Process the array to resolve any function-based dynamic links
    return links.map(link => (typeof link === 'function' ? link() : link));

  }, [userRole, currentCompany, commonLinks, t]); // Dependencies for the memo

  const activeLinks = profile ? linksForAuthenticatedUser : publicLinks
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      isScrolled ? 'bg-base-100/80 backdrop-blur-xl shadow-lg border-b border-base-300/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative items-center">
                {companiesLoading ? (
                  <div className="w-10 h-10 rounded-xl bg-base-300/50 " />
                ) : currentCompany?.logo ? (
                  <img
                    className="object-cover w-10 h-10 rounded-xl"
                    src={currentCompany.logo}
                    alt={currentCompany.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-company-logo.png';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-white shadow-lg">
                    {currentCompany?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {companiesLoading ? (
                    <div className="h-7 w-40 rounded bg-base-300/50" />
                  ) : (
                    currentCompany?.name || t('appName')
                  )}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {activeLinks.map(link => {
              if (link.isDropdown) {
                const isDropdownActive = link.subMenu && link.subMenu.some(subLink => location.pathname.startsWith(subLink.to));
                return (
                  <div key={link.label} className="relative" ref={aboutSubMenuRef}>
                    <button
                      onClick={toggleAboutSubMenu}
                      className={`relative px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
                        isDropdownActive
                          ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary'
                          : 'hover:bg-base-200/80'
                      }`}
                    >
                      <span className={`text-lg ${isDropdownActive ? 'text-primary' : ''}`}>
                        {isDropdownActive ? link.activeIcon : link.icon}
                      </span>
                      {link.label}
                      <FaChevronDown className={`w-3 h-3 ${isAboutSubMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isAboutSubMenuOpen && (
                      <div className="absolute left-0 mt-2 w-64 rounded-2xl shadow-xl bg-base-100/95 backdrop-blur-xl border border-base-300/20 z-50">
                        <div className="py-2">
                          {link.subMenu.map(subLink => {
                            const isSubActive = location.pathname.startsWith(subLink.to);
                            return (
                              <Link
                                key={subLink.to}
                                to={subLink.to}
                                onClick={() => setIsAboutSubMenuOpen(false)}
                                className={`flex items-center gap-3 px-5 py-3 text-sm ${
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
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary'
                        : 'hover:bg-base-200/80'
                    }`}
                  >
                    <span className={`text-lg ${isActive ? 'text-primary' : ''}`}>
                      {isActive ? link.activeIcon : link.icon}
                    </span>
                    {link.label}
                  </Link>
                );
              }
            })}

            {/* Language Switcher */}
            <div className="ml-3">
              <LanguageSwitcher />
            </div>

            {/* Profile Section */}
            {profileLoading ? (
              <div className="flex items-center space-x-3 ml-4">
                <div className="w-11 h-11 rounded-full bg-base-300/50" />
                <div className="h-5 w-28 bg-base-300/50 rounded" />
              </div>
            ) : profile ? (
              <div className="relative ml-4" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-base-200/80"
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg">
                      <div className="w-full h-full rounded-full overflow-hidden bg-base-100">
                        {profile.profilePic ? (
                          <img
                            src={profile.profilePic}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <FaUserCircle className="w-7 h-7 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-base-100 rounded-full z-10 shadow-lg"></div>
                  </div>
                  <span className="max-w-[140px] truncate font-medium">
                    {profile.name}
                  </span>
                  <FaChevronDown className={`w-3 h-3 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl bg-base-100/95 backdrop-blur-xl border border-base-300/20 z-50">
                    <div className="p-5 border-b border-base-300/20">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg">
                            <div className="w-full h-full rounded-full overflow-hidden bg-base-100">
                              {profile.profilePic ? (
                                <img
                                  src={profile.profilePic}
                                  alt={profile.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                  <FaUserCircle className="w-9 h-9 text-primary" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-base-100 rounded-full z-10 shadow-lg"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold truncate bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {profile.name}
                          </p>
                          <p className="text-sm text-base-content/60 truncate mt-0.5">
                            {profile.email}
                          </p>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary">
                              {profile.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      {(userRole === 'super_admin') && (
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-5 py-3 text-sm text-base-content/70 hover:bg-base-200/80"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mr-3 shadow-sm">
                            <HiOutlineCog className="w-5 h-5 text-primary" />
                          </div>
                          <span>{t('menu.admin') || 'Admin Panel'}</span>
                        </Link>
                      )}
                      {userRole === 'super_admin' && (
                        <Link
                          to="/setting"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-5 py-3 text-sm text-base-content/70 hover:bg-base-200/80"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mr-3 shadow-sm">
                            <HiOutlineCog className="w-5 h-5 text-primary" />
                          </div>
                          <span>{t('admin.settings') || 'Admin Settings'}</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-5 py-3 text-sm text-base-content/70 hover:bg-base-200/80"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mr-3 shadow-sm">
                          <HiOutlineUser className="w-5 h-5 text-primary" />
                        </div>
                        <span>{t('profile.settings') || 'Profile Settings'}</span>
                      </Link>
                      <div className="border-t border-base-300/20 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-5 py-3 text-sm text-error hover:bg-error/10"
                      >
                        <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center mr-3 shadow-sm">
                          <HiOutlineLogout className="w-5 h-5 text-error" />
                        </div>
                        <span>{t('auth.logout') || 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/20"
              >
                {t('login') || 'Login'}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2.5 rounded-xl hover:bg-base-200/80"
            >
              <span className="sr-only">{t('menu.open') || 'Open menu'}</span>
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 ${isMenuOpen ? 'rotate-45 translate-y-0' : 'rotate-0 -translate-y-2'}`}>
                  <span className="block absolute h-0.5 w-6 bg-current" />
                </span>
                <span className={`absolute inset-0 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="block absolute h-0.5 w-6 bg-current" />
                </span>
                <span className={`absolute inset-0 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'rotate-0 translate-y-2'}`}>
                  <span className="block absolute h-0.5 w-6 bg-current" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 z-40 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-base-200 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={` inset-0 w-full bg-base-200 shadow-2xl transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          ref={mobileMenuRef}
        >
          <div className="h-screen overflow-y-auto">
            {/* Mobile Close Button Only */}
            <div className="sticky top-0 z-10 bg-base-200 border-b border-base-300/20 flex justify-end px-4 py-3">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-base-200/80"
              >
                <span className="sr-only">Close menu</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 pt-4 pb-6 space-y-1">
              {/* Profile Section */}
              {profileLoading ? (
                <div className="flex items-center space-x-3 px-5 py-4">
                  <div className="w-12 h-12 rounded-full bg-base-300/50" />
                  <div className="h-5 w-32 bg-base-300/50 rounded" />
                </div>
              ) : profile ? (
                <div className="mb-6">
                  <div className="px-5 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg">
                          <div className="w-full h-full rounded-full overflow-hidden bg-base-100">
                            {profile.profilePic ? (
                              <img
                                src={profile.profilePic}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/default-avatar.png';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                <FaUserCircle className="w-9 h-9 text-primary" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-base-100 rounded-full z-10 shadow-lg"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-primary truncate">
                          {profile.name}
                        </p>
                        <p className="text-sm text-base-content/60 truncate mt-0.5">
                          {profile.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary">
                            {profile.type}
                          </span>
                          {profile.company && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-base-200/80 text-base-content/70">
                              {profile.company.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="px-5 py-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                        <span className="text-sm font-medium text-primary">Last Login</span>
                        <span className="text-xs text-base-content/60 mt-1">
                          {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                        <span className="text-sm font-medium text-primary">Status</span>
                        <span className="text-xs text-base-content/60 mt-1">
                          {profile.status || 'Active'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                        <span className="text-sm font-medium text-primary">Role</span>
                        <span className="text-xs text-base-content/60 mt-1">
                          {profile.role || profile.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons as List */}
                  <div className="divide-y divide-base-200 rounded-xl overflow-hidden shadow-sm bg-base-100 mt-4 mb-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 text-base font-medium text-base-content hover:bg-base-200/60"
                    >
                      <HiOutlineUser className="w-6 h-6 text-primary" />
                      {t('profile.settings') || 'Profile Settings'}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 text-base font-medium text-base-content hover:bg-base-200/60"
                    >
                      <HiOutlineCog className="w-6 h-6 text-primary" />
                      {t('settings') || 'Settings'}
                    </Link>
                    {(userRole === 'admin' || userRole === 'super_admin') && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-4 text-base font-medium text-base-content hover:bg-base-200/60"
                      >
                        <HiOutlineCog className="w-6 h-6 text-primary" />
                        {t('menu.admin') || 'Admin Panel'}
                      </Link>
                    )}
                    {userRole === 'super_admin' && (
                      <Link
                        to="/admin/settings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-4 text-base font-medium text-base-content hover:bg-base-200/60"
                      >
                        <HiOutlineCog className="w-6 h-6 text-primary" />
                        {t('admin.settings') || 'Admin Settings'}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 w-full px-5 py-4 text-base font-medium text-error hover:bg-error/10"
                    >
                      <HiOutlineLogout className="w-6 h-6" />
                      {t('auth.logout') || 'Logout'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 px-5">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-5 py-4 rounded-xl text-base font-medium bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/20"
                  >
                    {t('login') || 'Login'}
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1 mt-2">
                {activeLinks.map(link => {
                  if (link.isDropdown) {
                    const isDropdownActive = link.subMenu && link.subMenu.some(subLink => location.pathname.startsWith(subLink.to));
                    const isSubMenuOpen = openMobileSubMenu === link.label;
                    return (
                      <div key={link.label} className="border-b border-base-300/20 last:border-0">
                        <button
                          onClick={() => toggleMobileSubMenu(link.label)}
                          className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl text-base font-medium ${
                            isDropdownActive
                              ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary'
                              : 'text-base-content/100 hover:bg-base-200/80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xl ${isDropdownActive ? 'text-primary' : ''}`}>
                              {isDropdownActive ? link.activeIcon : link.icon}
                            </span>
                            {link.label}
                          </div>
                          <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isSubMenuOpen ? 'max-h-96' : 'max-h-0'
                          }`}
                        >
                          <div className="pl-14 pt-1 pb-2 space-y-1">
                            {link.subMenu.map(subLink => {
                              const isSubActive = location.pathname.startsWith(subLink.to);
                              return (
                                <Link
                                  key={subLink.to}
                                  to={subLink.to}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium ${
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
                        </div>
                      </div>
                    );
                  } else {
                    const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-5 py-4 rounded-xl text-base font-medium ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary'
                            : 'text-base-content/100 hover:bg-base-200/80'
                        }`}
                      >
                        <span className={`text-xl ${isActive ? 'text-primary' : ''}`}>
                          {isActive ? link.activeIcon : link.icon}
                        </span>
                        {link.label}
                      </Link>
                    );
                  }
                })}
              </div>
              
              {/* Mobile Language Switcher */}
              <div className="border-t border-base-300/20 pt-4 mt-4">
                <div className="px-5">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 px-5">
                <div className="text-center text-xs text-base-content/40">
                  <p>© 2024 Your Company</p>
                  <p className="mt-1">Version 1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
            