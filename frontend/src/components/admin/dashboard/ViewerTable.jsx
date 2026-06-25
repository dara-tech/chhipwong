import React from "react";

const ViewerTable = ({ viewers, loading, error }) => (
  <div className="bg-base-100 rounded-xl p-4 shadow border border-base-300/20 mt-4">
    <h2 className="text-sm font-semibold mb-3 text-base-content/80 uppercase tracking-wide">Recent Viewers</h2>
    {loading ? (
      <div className="text-sm text-base-content/50">Loading...</div>
    ) : error ? (
      <div className="text-error text-sm">{error}</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="table table-sm w-full">
          <thead>
            <tr className="bg-base-200/50">
              <th className="p-2.5 text-xs font-semibold text-left text-base-content/60">IP</th>
              <th className="p-2.5 text-xs font-semibold text-left text-base-content/60">Location</th>
              <th className="p-2.5 text-xs font-semibold text-left text-base-content/60">Path</th>
              <th className="p-2.5 text-xs font-semibold text-left text-base-content/60">Referrer</th>
              <th className="p-2.5 text-xs font-semibold text-left text-base-content/60">Visited At</th>
            </tr>
          </thead>
          <tbody>
            {viewers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-3 text-sm text-base-content/50">No viewers found.</td>
              </tr>
            ) : viewers.map((v, idx) => (
              <tr key={v._id || idx} className="border-b border-base-300/50 hover:bg-base-200/30">
                <td className="p-2.5 text-xs">{v.ip}</td>
                <td className="p-2.5 text-xs">
                  {v.location && v.location.country
                    ? `${v.location.country}${v.location.city ? ', ' + v.location.city : ''}`
                    : 'Unknown'}
                </td>
                <td className="p-2.5 text-xs">{v.path}</td>
                <td className="p-2.5 text-xs">{v.referrer || '-'}</td>
                <td className="p-2.5 text-xs">{new Date(v.visitedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default ViewerTable; 