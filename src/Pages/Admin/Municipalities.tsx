import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useMunicipalities, useAddMunicipality, useDeleteMunicipality } from "../../Hooks/Admin/MunicipalityHooks";

const Municipalities: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate = useNavigate(); // Initialize useNavigate
  const { data} = useMunicipalities();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMunicipality, setNewMunicipality] = useState({ name: "", state: "" });
  const addMunicipalityMutation = useAddMunicipality();
  const deleteMunicipalityMutation = useDeleteMunicipality();

  const paginatedData = Array.isArray(data) ? data.slice((page - 1) * limit, page * limit) : [];

  const handleNext = () => {
    if (data && data.length > page * limit) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleDeleteMunicipality = (id: number) => {
    deleteMunicipalityMutation.mutate(id);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddMunicipality = () => {
    if (!newMunicipality.name.trim()) return;
    addMunicipalityMutation.mutate(newMunicipality, {
      onSuccess: () => {
        setNewMunicipality({ name: "", state: "" });
        toggleModal();
      },
      onError: () => {
        alert("There was an error while adding the municipality.");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 h-auto rounded-md shadow">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Municipalities</h2>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Municipality List</h2>
        <div className="flex gap-4">
          <button
            className="bg-green-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all"
            onClick={toggleModal}
          >
            + Create Municipality
          </button>
          <button
            className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
            onClick={() => navigate("/municipality-by-state")} // Navigate to Municipality by State
          >
            Municipality by State
          </button>
        </div>
      </div>

      {/* Municipalities Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-900 text-white border-b">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">State</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.length ? (
              paginatedData.map((municipality) => (
                <tr key={municipality.municipalityId} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{municipality.municipalityId}</td>
                  <td className="py-3 px-4">{municipality.name}</td>
                  <td className="py-3 px-4">{municipality.state ?? "N/A"}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteMunicipality(municipality.municipalityId)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 px-4 text-center text-gray-500">
                  No more data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700 font-semibold">Page {page}</span>
        <button
          onClick={handleNext}
          disabled={!data || data.length <= page * limit}
          className={`px-4 py-2 rounded-lg ${!data || data.length <= page * limit ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          Next
        </button>
      </div>

      {/* Modal for Adding Municipality */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 shadow-md rounded-md w-96">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">Add Municipality</h3>
            <div>
              <input
                type="text"
                placeholder="Municipality Name"
                value={newMunicipality.name}
                onChange={(e) => setNewMunicipality({ ...newMunicipality, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
              />
              <input
                type="text"
                placeholder="State"
                value={newMunicipality.state}
                onChange={(e) => setNewMunicipality({ ...newMunicipality, state: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
              />
              <button
                onClick={handleAddMunicipality}
                className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Municipalities;
