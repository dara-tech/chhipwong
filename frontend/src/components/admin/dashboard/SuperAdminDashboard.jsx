import React, { useEffect, useState } from 'react';
import { 
  RiUserLine, 
  RiBuildingLine, 
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiServerLine
} from 'react-icons/ri';
import useUserManagement from '../../../hooks/useUserManagement';
import useCompanies from '../../../hooks/useCompanies';
import usePaymentGateways from '../../../hooks/usePaymentGateways';
import checkServerHealth from '../../../utils/serverHealth';
import useViewers from '../../../hooks/useViewers';
import ViewerTable from './ViewerTable';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-base-content/60">{title}</p>
        <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {value}
        </h3>
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend !== undefined && (
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-sm ${trend > 0 ? 'text-success' : 'text-error'}`}>{trend > 0 ? '+' : ''}{trend}%</span>
        <span className="text-sm text-base-content/60">vs last month</span>
      </div>
    )}
  </div>
);

const SuperAdminDashboard = () => {
  // Real data hooks
  const { users, loading: usersLoading, error: usersError, fetchUsers } = useUserManagement();
  const { companies, loading: companiesLoading, error: companiesError, getCompanies } = useCompanies();
  const { gateways, loading: gatewaysLoading } = usePaymentGateways();
  const { viewers, loading: viewersLoading, error: viewersError } = useViewers();
  const [systemHealth, setSystemHealth] = useState(null);
  const [systemHealthLoading, setSystemHealthLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { getCompanies(); }, []);
  useEffect(() => {
    const checkHealth = async () => {
      setSystemHealthLoading(true);
      const healthy = await checkServerHealth();
      setSystemHealth(healthy);
      setSystemHealthLoading(false);
    };
    checkHealth();
  }, []);

  // Sort users by lastLogin descending
  const recentLogins = [...(users || [])]
    .filter(u => u.lastLogin)
    .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
    .slice(0, 5);

  // Stats
  const stats = {
    totalUsers: usersLoading ? '...' : users?.length || 0,
    activeCompanies: companiesLoading ? '...' : companies?.length || 0,
    totalViews: viewersLoading ? '...' : viewers?.length || 0,
    systemHealth: systemHealthLoading ? '...' : (systemHealth ? 'Operational' : 'Down'),
    activeAlerts: 3, // Placeholder, replace with real alert count if available
    serverLoad: '45%' // Placeholder, replace with real server load if available
  };

  return (
    <div className="space-y-6 pt-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Super Admin Dashboard
          </h1>
          <p className="text-base-content/60 mt-1">
            Welcome back! Here's what's happening with your system.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn btn-primary gap-2">
            <RiAlertLine className="w-4 h-4" />
            View Alerts
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={RiUserLine}
          color="bg-primary"
        />
        <StatCard
          title="Active Companies"
          value={stats.activeCompanies}
          icon={RiBuildingLine}
          color="bg-secondary"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={RiMoneyDollarCircleLine}
          color="bg-success"
        />
        <StatCard
          title="System Health"
          value={stats.systemHealth}
          icon={RiShieldCheckLine}
          color="bg-info"
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon={RiAlertLine}
          color="bg-warning"
        />
        <StatCard
          title="Server Load"
          value={stats.serverLoad}
          icon={RiServerLine}
          color="bg-base-content"
        />
      </div>

      {/* Recent Logins Table */}
      <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
        <h2 className="text-lg font-semibold mb-4">Recent User Logins</h2>
        {usersLoading ? (
          <div>Loading...</div>
        ) : usersError ? (
          <div className="text-error">{usersError}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="p-4 font-semibold text-left">User</th>
                  <th className="p-4 font-semibold text-left">Last Login</th>
                  <th className="p-4 font-semibold text-left">IP Address</th>
                  <th className="p-4 font-semibold text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {recentLogins.length === 0 ? (
                  <tr><td colSpan={4} className="text-center p-4">No recent logins.</td></tr>
                ) : recentLogins.map(user => (
                  <tr key={user._id} className="border-b border-base-300">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.profilePic ? (
                            <img src={user.profilePic} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <RiUserLine className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                    <td className="p-4">{user.lastLoginIp || '-'}</td>
                    <td className="p-4">
                      {user.lastLoginLocation && typeof user.lastLoginLocation === 'object' && user.lastLoginLocation.status !== 'fail'
                        ? `${user.lastLoginLocation.country || ''}${user.lastLoginLocation.city ? ', ' + user.lastLoginLocation.city : ''}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Map of Viewer Locations (Advanced) */}
      <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
        <h2 className="text-lg font-semibold mb-4">Viewer Locations</h2>
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {/* Marker Clustering */}
            <MarkerClusterGroup>
              {viewers && viewers.filter(v => v.location && v.location.ll && Array.isArray(v.location.ll)).map((v, idx) => (
                <Marker key={v._id || idx} position={v.location.ll}>
                  <Popup>
                    <div>
                      <div><b>IP:</b> {v.ip}</div>
                      <div><b>Country:</b> {v.location.country || 'Unknown'}</div>
                      <div><b>City:</b> {v.location.city || 'Unknown'}</div>
                      <div><b>Path:</b> {v.path}</div>
                      <div><b>Visited At:</b> {new Date(v.visitedAt).toLocaleString()}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>

      {/* System Status - Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base-content/60">API Status</span>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-content/60">Database Status</span>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-content/60">Cache Status</span>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm">Operational</span>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-primary btn-outline gap-2">
              <RiUserLine className="w-4 h-4" />
              Add User
            </button>
            <button className="btn btn-secondary btn-outline gap-2">
              <RiBuildingLine className="w-4 h-4" />
              Add Company
            </button>
            <button className="btn btn-accent btn-outline gap-2">
              <RiMoneyDollarCircleLine className="w-4 h-4" />
              View Reports
            </button>
            <button className="btn btn-info btn-outline gap-2">
              <RiShieldCheckLine className="w-4 h-4" />
              Security
            </button>
          </div>
        </div>
      </div>
      {/* Viewers Table */}
      <ViewerTable viewers={viewers} loading={viewersLoading} error={viewersError} />
    </div>
  );
};

export default SuperAdminDashboard; 