import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserManagement from '../../../hooks/useUserManagement';
import { Edit, Trash2, Search, Plus, Filter, ChevronDown, AlertCircle } from 'lucide-react';
import { FaUserShield, FaUserCog, FaUser } from 'react-icons/fa';
import AdvancedPagination from '../../common/AdvancedPagination';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const UserManagementPage = () => {
  const { users, loading, error, fetchUsers, deleteUser } = useUserManagement();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const pageSize = 10;

  const isSuperAdmin = useMemo(() => profile?.type === 'super_admin', [profile]);
  const isAdmin = useMemo(() => profile?.type === 'admin', [profile]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const canEditUser = useCallback((user) => {
    if (user._id === profile?.id) return false;
    if (isSuperAdmin) return true;
    if (isAdmin) return user.type !== 'admin' && user.type !== 'super_admin';
    return false;
  }, [profile, isSuperAdmin, isAdmin]);

  const canDeleteUser = useCallback((user) => {
    if (user._id === profile?.id) return false;
    if (isSuperAdmin) return true;
    if (isAdmin) return user.type !== 'admin' && user.type !== 'super_admin';
    return false;
  }, [profile, isSuperAdmin, isAdmin]);

  const handleEditClick = (user) => {
    if (canEditUser(user)) {
      navigate(`/users/${user._id}`);
    } else {
      toast.error("You don't have permission to edit this user.", { id: `edit-${user._id}` });
    }
  };

  const handleDeleteAttempt = (user) => {
    if (user._id === profile?.id) {
        toast.error("You cannot delete your own profile.", { id: `delete-self-${user._id}` });
        return;
    }
    if (canDeleteUser(user)) {
      setUserToDelete(user);
      document.getElementById('delete_user_modal').showModal();
    } else {
      toast.error("You don't have permission to delete this user.", { id: `delete-${user._id}` });
    }
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete._id);
      setUserToDelete(null);
      document.getElementById('delete_user_modal').close();
    }
  };

  const filteredUsers = useMemo(() => {
    return (users || []).filter(user => {
      if (isAdmin && user.type === 'super_admin') return false;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower);
      const matchesFilter = filterType ? user.type === filterType : true;
      
      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, filterType, isAdmin]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getRoleBadge = (type) => {
    const roleStyles = {
      super_admin: { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: <FaUserShield />, label: 'Super Admin' },
      admin: { bg: 'bg-error/10', text: 'text-error', icon: <FaUserShield />, label: 'Admin' },
      payment_viewer: { bg: 'bg-primary/10', text: 'text-primary', icon: <FaUserCog />, label: 'Payment Viewer' },
      user: { bg: 'bg-base-300/10', text: 'text-base-content/70', icon: <FaUser />, label: 'User' },
    };
    const style = roleStyles[type] || roleStyles.user;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${style.bg} ${style.text}`}>
        {React.cloneElement(style.icon, { className: 'w-3 h-3' })}
        {style.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-base-200 pt-14">
      <header className={`sticky top-0 z-30 bg-base-100/90 backdrop-blur-lg border-b ${isHeaderScrolled ? 'border-base-300/50 shadow-sm' : 'border-transparent'}`}>
        <div className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-3">
            <div>
              <h1 className="text-xl font-bold text-base-content">User Management</h1>
              <p className="text-sm text-base-content/60">Manage all users in the system.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="input input-bordered input-sm w-full pl-9"
              />
            </div>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                Filter by Role
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 z-40">
                <li><a onClick={() => handleFilterChange('')} className={!filterType ? 'font-bold' : ''}>All Roles</a></li>
                {isSuperAdmin && <li><a onClick={() => handleFilterChange('super_admin')} className={filterType === 'super_admin' ? 'font-bold' : ''}>Super Admin</a></li>}
                <li><a onClick={() => handleFilterChange('admin')} className={filterType === 'admin' ? 'font-bold' : ''}>Admin</a></li>
                <li><a onClick={() => handleFilterChange('payment_viewer')} className={filterType === 'payment_viewer' ? 'font-bold' : ''}>Payment Viewer</a></li>
                <li><a onClick={() => handleFilterChange('user')} className={filterType === 'user' ? 'font-bold' : ''}>User</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-3 md:p-4">
        {loading && (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        )}
        {error && <div className="alert alert-error shadow-sm text-sm"><div><AlertCircle className="w-4 h-4" /><span>{error}</span></div></div>}
        {!loading && !error && (
          <>
            {totalUsers > 0 ? (
              <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                <table className="table table-sm w-full">
                  <thead className="bg-base-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-base-content/60">User</th>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-base-content/60">Role</th>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-base-content/60 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map(user => (
                      <tr 
                        key={user._id} 
                        onClick={() => handleEditClick(user)} 
                        className={`transition-colors duration-150 cursor-pointer ${user._id === profile?.id ? 'bg-primary/5' : 'hover:bg-base-200/60'}`}>
                        <td className="p-2.5">
                          <div className="flex items-center space-x-2.5">
                            <div className="avatar placeholder">
                              <div className="bg-neutral-focus text-neutral-content rounded-full w-8 h-8">
                                <span className="text-xs font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold flex items-center gap-1.5">
                                {user.name}
                                {user._id === profile?.id && <span className="badge badge-xs badge-outline badge-primary font-bold">You</span>}
                              </div>
                              <div className="text-xs opacity-50">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2.5">{getRoleBadge(user.type)}</td>
                        <td className="p-2.5 text-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAttempt(user);
                            }} 
                            className="btn btn-ghost btn-xs text-error hover:bg-error/10" 
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-base-100 rounded-xl shadow">
                <h3 className="text-base font-semibold">No users found</h3>
                <p className="text-sm text-base-content/60 mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </>
        )}
      </main>

      {!loading && !error && totalPages > 1 && (
        <footer className="sticky bottom-0 z-20 bg-base-100/90 backdrop-blur-lg p-4 border-t border-base-300/50">
          <AdvancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </footer>
      )}

      <dialog id="delete_user_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn">Cancel</button>
              <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default UserManagementPage;