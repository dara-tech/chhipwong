import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCompanies from "../../../hooks/useCompanies";
import { FaBuilding, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const CompanyList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { companies, getCompanies, deleteCompany } = useCompanies();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        await getCompanies();
      } catch (err) {
        setError("Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanies();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompany(id);
        await getCompanies(); // Refresh the list
      } catch (err) {
        setError("Failed to delete company");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded" />
        </div>

        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-200 rounded" />
                <div>
                  <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="w-8 h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-screen">
      <div className="divide-y divide-gray-200">
        {companies.map((company) => (
          <div key={company._id} className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-16 object-cover rounded"
                />
              ) : (
                <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded">
                  <FaBuilding className="text-3xl text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{company.name}</h3>
                <p className="text-sm text-gray-600">
                  {company.contact?.address || "No address provided"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/admin/companies/${company._id}`}
                className="btn btn-ghost btn-sm"
              >
                <FaEdit /> 
              </Link>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No companies found. Add your first company!</p>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
