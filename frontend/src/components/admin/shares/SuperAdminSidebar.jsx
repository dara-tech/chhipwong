import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  RiDashboardLine, 
  RiDashboardFill,
  RiUserSettingsLine,
  RiUserSettingsFill,
  RiSettings4Line,
  RiSettings4Fill,
  RiShieldUserLine,
  RiShieldUserFill,
  RiDatabaseLine,
  RiDatabaseFill,
  RiFileListLine,
  RiFileListFill,
  RiAlertLine,
  RiAlertFill,
  RiTeamLine,
  RiTeamFill,
  RiGlobalLine,
  RiGlobalFill,
  RiLockLine,
  RiLockFill,
  RiServerLine,
  RiServerFill,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';
import { FaUserShield } from 'react-icons/fa';

const SuperAdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState('dashboard');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = {
    dashboard: {
      icon: <RiDashboardLine className="w-5 h-5" />,
      activeIcon: <RiDashboardFill className="w-5 h-5" />,
      label: 'Dashboard',
      path: '/admin/dashboard',
      subItems: [
        { label: 'Overview', path: '/admin/dashboard' },
        { label: 'Analytics', path: '/admin/dashboard/analytics' },
        { label: 'Reports', path: '/admin/dashboard/reports' }
      ]
    },
    users: {
      icon: <RiTeamLine className="w-5 h-5" />,
      activeIcon: <RiTeamFill className="w-5 h-5" />,
      label: 'User Management',
      path: '/admin/users',
      subItems: [
        { label: 'All Users', path: '/admin/users' },
        { label: 'Roles & Permissions', path: '/admin/users/roles' },
        { label: 'Activity Logs', path: '/admin/users/activity' }
      ]
    },
    security: {
      icon: <RiShieldUserLine className="w-5 h-5" />,
      activeIcon: <RiShieldUserFill className="w-5 h-5" />,
      label: 'Security',
      path: '/admin/security',
      subItems: [
        { label: 'Access Control', path: '/admin/security/access' },
        { label: 'Authentication', path: '/admin/security/auth' },
        { label: 'API Keys', path: '/admin/security/api-keys' }
      ]
    },
    settings: {
      icon: <RiSettings4Line className="w-5 h-5" />,
      activeIcon: <RiSettings4Fill className="w-5 h-5" />,
      label: 'System Settings',
      path: '/admin/settings',
      subItems: [
        { label: 'General', path: '/admin/settings/general' },
        { label: 'Email', path: '/admin/settings/email' },
        { label: 'Integrations', path: '/admin/settings/integrations' }
      ]
    },
    logs: {
      icon: <RiFileListLine className="w-5 h-5" />,
      activeIcon: <RiFileListFill className="w-5 h-5" />,
      label: 'System Logs',
      path: '/admin/logs',
      subItems: [
        { label: 'Audit Logs', path: '/admin/logs/audit' },
        { label: 'Error Logs', path: '/admin/logs/errors' },
        { label: 'Access Logs', path: '/admin/logs/access' }
      ]
    },
    backup: {
      icon: <RiDatabaseLine className="w-5 h-5" />,
      activeIcon: <RiDatabaseFill className="w-5 h-5" />,
      label: 'Backup & Restore',
      path: '/admin/backup',
      subItems: [
        { label: 'Database', path: '/admin/backup/database' },
        { label: 'Files', path: '/admin/backup/files' },
        { label: 'Restore', path: '/admin/backup/restore' }
      ]
    },
    monitoring: {
      icon: <RiServerLine className="w-5 h-5" />,
      activeIcon: <RiServerFill className="w-5 h-5" />,
      label: 'System Monitoring',
      path: '/admin/monitoring',
      subItems: [
        { label: 'Performance', path: '/admin/monitoring/performance' },
        { label: 'Resources', path: '/admin/monitoring/resources' },
        { label: 'Alerts', path: '/admin/monitoring/alerts' }
      ]
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-base-100 border-r border-base-300/20 transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Super Admin Badge */}
      <div className={`p-4 border-b border-base-300/20 ${collapsed ? 'text-center' : 'flex items-center gap-3'}`}>
        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <FaUserShield className="w-5 h-5 text-purple-500" />
        </div>
        {!collapsed && (
          <div>
            <h2 className="text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              Super Admin
            </h2>
            <p className="text-xs text-base-content/60">System Control</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-base-100 border border-base-300/20 flex items-center justify-center hover:bg-base-200/80 transition-colors"
      >
        {collapsed ? (
          <RiArrowRightSLine className="w-4 h-4" />
        ) : (
          <RiArrowLeftSLine className="w-4 h-4" />
        )}
      </button>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-5rem)]">
        {Object.entries(menuItems).map(([key, item]) => (
          <div key={key} className="space-y-1">
            <button
              onClick={() => toggleSection(key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-500'
                  : 'hover:bg-base-200/80'
              }`}
            >
              <span className="text-lg">
                {isActive(item.path) ? item.activeIcon : item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <RiArrowRightSLine 
                    className={`w-4 h-4 transition-transform ${
                      expandedSection === key ? 'rotate-90' : ''
                    }`}
                  />
                </>
              )}
            </button>

            {/* Submenu Items */}
            {!collapsed && expandedSection === key && (
              <div className="pl-10 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive(subItem.path)
                        ? 'bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-500'
                        : 'hover:bg-base-200/80'
                    }`}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-base-content/60">System Status</span>
              <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-base-content/60">Version</span>
              <span className="text-base-content/80">1.0.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSidebar; 