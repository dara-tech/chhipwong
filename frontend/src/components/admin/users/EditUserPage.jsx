import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUserManagement from '../../../hooks/useUserManagement';
import useAuth from '../../../hooks/useAuth';
import { User, Mail, Shield, Save, XCircle, AlertCircle, Loader } from 'lucide-react';
import { FaUser, FaEnvelope, FaUserShield, FaUserCog } from 'react-icons/fa';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, updateUserByAdmin, error: userError, loading } = useUserManagement();
  const { profile } = useAuth();

  // Debug log for id
  console.log('EditUserPage id:', id);

  // Guard: If id is undefined, show error and do not fetch
  const [invalidId, setInvalidId] = useState(false);
  useEffect(() => {
    if (!id) {
      setInvalidId(true);
    } else {
      setInvalidId(false);
    }
  }, [id]);

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', type: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditingSelf, setIsEditingSelf] = useState(false);

  useEffect(() => {
    if (profile && profile.id === id) {
      setIsEditingSelf(true);
    } else {
      setIsEditingSelf(false);
    }
  }, [profile, id]);

  useEffect(() => {
    const fetchUserData = async () => {
      setError('');
      try {
        const data = await getUserById(id);
        const userObj = data.user || data;
        if (userObj) {
          setUser(userObj);
          setFormData({ name: userObj.name, email: userObj.email, type: userObj.type });
        } else {
          setError('User not found or failed to fetch data.');
          setTimeout(() => navigate('/users'), 2000);
        }
      } catch (err) {
        setError(err?.message || 'An unexpected error occurred while fetching user data.');
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id, getUserById, navigate]);

  useEffect(() => {
    if (userError) {
      setError(userError);
    }
  }, [userError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditingSelf) {
      setError("You cannot edit your own profile from this page.");
      return;
    }
    setError('');
    setSuccess('');

    try {
      const result = await updateUserByAdmin(id, formData);
      if (result && result.user) {
        setSuccess(result.message || 'User updated successfully!');
        setTimeout(() => navigate('/users'), 2000);
      } else {
        setError(result?.message || 'Failed to update user.');
      }
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred.');
    }
  };

  if (invalidId) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6 pt-20">
          <div className="alert alert-error shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Invalid user ID. Please return to the user list.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !user) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6 pt-20">
          {/* Cyberpunk-style title skeleton */}
          <div className="space-y-3">
            <div className="relative">
              <div className="h-8 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-lg animate-pulse"></div>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shine"></div>
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>
            <div className="relative w-1/2">
              <div className="h-4 bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 rounded-lg animate-pulse"></div>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shine"></div>
            </div>
          </div>
          
          <div className="relative bg-base-100/30 backdrop-blur-md p-8 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 animate-pulse"></div>
            <div className="absolute inset-0 rounded-xl bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] animate-shine"></div>
            
            <div className="space-y-6 relative">
              {/* Cyberpunk form field skeletons */}
              {[1, 2, 3].map((index) => (
                <div key={index} className="form-control group">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shine"></div>
                    </div>
                    <div className="relative">
                      <div className="h-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-lg w-24 animate-pulse"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shine"></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-10 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-lg animate-pulse"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shine"></div>
                    <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                  </div>
                </div>
              ))}
              
              {/* Cyberpunk button skeletons */}
              <div className="flex justify-end space-x-4 pt-4">
                <div className="relative">
                  <div className="h-10 w-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shine"></div>
                </div>
                <div className="relative">
                  <div className="h-10 w-32 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-lg animate-pulse"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-shine"></div>
                  <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6 pt-20">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Edit User
          </h1>
          <p className="text-sm text-base-content/60">
            Update user information and permissions
          </p>
        </div>

        <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            {success && (
              <div className="alert alert-success shadow-lg">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{success}</span>
                </div>
              </div>
            )}
            {isEditingSelf && (
              <div className="alert alert-warning shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>You cannot edit your own profile here. Please use the account settings page.</span>
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FaUser className="text-primary" />
                  Name
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full focus:border-none focus:ring-0 focus:outline-primary"
                required
                disabled={isEditingSelf}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  Email
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full focus:border-none focus:ring-0 focus:outline-primary"
                required
                disabled={isEditingSelf}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FaUserShield className="text-primary" />
                  Role
                </span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="select select-bordered w-full focus:border-none focus:ring-0 focus:outline-primary"
                disabled={isEditingSelf}
              >
                <option value="user">User</option>
                <option value="payment_viewer">Payment Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="btn btn-ghost gap-2 hover:bg-base-200 transition-colors duration-200"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-300" 
                disabled={loading || isEditingSelf}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
