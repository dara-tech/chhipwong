import React, { useState, useEffect } from 'react';
import useCompanies from '../../hooks/useCompanies';
import ProfessionalCard from './component/ProfessionalCard';
import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle, FaSearch, FaFilter, FaUsers, FaBuilding } from 'react-icons/fa';

const ProfessionalPage = () => {
  const { getCompanies } = useCompanies();
  const [allProfessionals, setAllProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const companiesData = await getCompanies();
        if (companiesData && companiesData.length > 0) {
          const profs = companiesData.flatMap(company => 
            company.professionals ? company.professionals.map(p => ({...p, companyName: company.name})) : []
          );
          setAllProfessionals(profs);
          setFilteredProfessionals(profs);

          const roleList = [...new Set(profs.map(p => p.role))];
          setRoles(roleList);
        }
        setError(null);
      } catch (err) {
        setError(t('professionalsManager.fetchError', 'Failed to fetch professionals.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [t]);

  useEffect(() => {
    let results = allProfessionals;

    if (searchTerm) {
      results = results.filter(prof =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole) {
      results = results.filter(prof => prof.role === selectedRole);
    }

    setFilteredProfessionals(results);
  }, [searchTerm, selectedRole, allProfessionals]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 w-3/4 mx-auto bg-base-300 rounded-xl"></div>
            <div className="h-6 w-1/2 mx-auto bg-base-300 rounded-lg mt-4"></div>
          </div>

          <div className="mb-12 p-6 bg-base-200/50 backdrop-blur-sm rounded-2xl shadow-xl border border-base-300 flex flex-col sm:flex-row gap-4 items-center">
            <div className="h-12 w-full bg-base-300 rounded-xl"></div>
            <div className="h-12 w-full sm:w-48 bg-base-300 rounded-xl"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-base-200/50 backdrop-blur-sm rounded-2xl shadow-xl border border-base-300 overflow-hidden"
              >
                <div className="h-64 bg-base-300"></div>
                <div className="p-6 space-y-4">
                  <div className="h-7 w-3/4 bg-base-300 rounded-lg"></div>
                  <div className="h-5 w-1/2 bg-base-300 rounded-lg"></div>
                  <div className="h-20 w-full bg-base-300 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex flex-col justify-center items-center px-4">
        <div className="bg-base-200/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center max-w-md">
          <FaExclamationTriangle className="text-error text-5xl mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-error mb-4">Oops!</h2>
          <p className="text-lg text-base-content/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-16 px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-20">
          <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-6 ">
            <FaUsers className="text-4xl text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-base-content mb-6">
            {t('professionalsManager.title', 'Our Professionals')}
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            {t('professionalsManager.subtitle', 'Meet the talented individuals driving our success.')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-6 border border-base-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FaUsers className="text-2xl text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-base-content">{filteredProfessionals.length}</h3>
                <p className="text-base-content/70">Total Professionals</p>
              </div>
            </div>
          </div>
          <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-6 border border-base-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <FaBuilding className="text-2xl text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-base-content">{roles.length}</h3>
                <p className="text-base-content/70">Unique Roles</p>
              </div>
            </div>
          </div>
          <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-6 border border-base-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <FaFilter className="text-2xl text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-base-content">
                  {selectedRole ? '1' : roles.length}
                </h3>
                <p className="text-base-content/70">
                  {selectedRole ? 'Selected Role' : 'Available Roles'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 p-6 bg-base-200/50 backdrop-blur-sm rounded-2xl shadow-xl border border-base-300">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder={t('professionalsManager.searchPlaceholder', 'Search by name or role...')}
                className="input input-bordered w-full pl-12 bg-base-100/50 backdrop-blur-sm hover:border-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <select
                className="select select-bordered w-full pl-12 bg-base-100/50 backdrop-blur-sm hover:border-primary focus:border-primary"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">{t('professionalsManager.allProfessionals', 'All Professionals')}</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Professionals Grid */}
        {filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProfessionals.map((prof) => (
              <div
                key={prof._id || prof.name}
                className="transform hover:scale-[1.02]"
              >
                <ProfessionalCard professional={prof} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-base-200/50 backdrop-blur-sm rounded-2xl shadow-xl border border-base-300">
            <div className="inline-block p-4 bg-base-300/50 rounded-full mb-4">
              <FaSearch className="text-3xl text-base-content/50" />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              {t('professionalsManager.noResults', 'No professionals found')}
            </h3>
            <p className="text-base-content/70">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalPage;
