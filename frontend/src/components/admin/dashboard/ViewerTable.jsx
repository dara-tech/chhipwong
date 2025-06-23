import React from "react";

const ViewerTable = ({ viewers, loading, error }) => (
  <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20 mt-6">
    <h2 className="text-lg font-semibold mb-4">Recent Viewers</h2>
    {loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div className="text-error">{error}</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200/50">
              <th className="p-4 font-semibold text-left">IP</th>
              <th className="p-4 font-semibold text-left">Location</th>
              <th className="p-4 font-semibold text-left">Path</th>
              <th className="p-4 font-semibold text-left">Referrer</th>
              <th className="p-4 font-semibold text-left">Visited At</th>
            </tr>
          </thead>
          <tbody>
            {viewers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">No viewers found.</td>
              </tr>
            ) : viewers.map((v, idx) => (
              <tr key={v._id || idx} className="border-b border-base-300">
                <td className="p-4">{v.ip}</td>
                <td className="p-4">
                  {v.location && v.location.country
                    ? `${v.location.country}${v.location.city ? ', ' + v.location.city : ''}`
                    : 'Unknown'}
                </td>
                <td className="p-4">{v.path}</td>
                <td className="p-4">{v.referrer || '-'}</td>
                <td className="p-4">{new Date(v.visitedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default ViewerTable; 