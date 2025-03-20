import React, { useState } from "react";
import { useMunicipalitiesByState } from "../../Hooks/Admin/MunicipalityHooks";

const MunicipalitiesByState: React.FC = () => {
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  
  const { data, error, isLoading } = useMunicipalitiesByState(state, page, pageSize);

  const handleNext = () => {
    if (data && page < data.totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="max-w-4xl w-full mx-auto p-4 bg-gray-100 h-auto rounded-md shadow">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Municipalities by State</h2>

        {/* State Input Field */}
        <div className="mb-6 flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter state to fetch municipalities..."
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Municipalities Table */}
        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Error fetching data</p>}

        {data?.data.length ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-900 text-white border-b">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">State</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((municipality) => (
                  <tr key={municipality.municipalityId} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{municipality.municipalityId}</td>
                    <td className="py-3 px-4">{municipality.name}</td>
                    <td className="py-3 px-4">{municipality.state ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No municipalities found.</p>
        )}

        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 font-semibold">Page {page} of {data?.totalPages || 1}</span>
            <button
              onClick={handleNext}
              disabled={page >= (data?.totalPages || 1)}
              className={`px-4 py-2 rounded-lg ${page >= (data?.totalPages || 1) ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MunicipalitiesByState;
