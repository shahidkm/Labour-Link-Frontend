import { useState } from "react";
import { useAddSkill, useDeleteSkill, useGetSkills } from "../../Hooks/Admin/SkillHooks";

const Skills: React.FC = () => {
  const [skillname, setSkillname] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  // Fetch skills using the custom hook
  const { data: skills, isLoading, isError } = useGetSkills(page, limit);

  const addSkillMutation = useAddSkill();
  const deleteSkillMutation = useDeleteSkill();

  // Handle adding new skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillname.trim()) return;

    addSkillMutation.mutate({ name: skillname });
    setSkillname("");
  };

  // Handle deleting skill
  const handleDeleteSkill = (id: string) => {
    deleteSkillMutation.mutate(id);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return; // Prevent going below page 1
    setPage(newPage);
  };

  const isNextDisabled = !skills || skills.length < limit; // Disable "Next" button if fewer than `limit` skills are returned

  if (isLoading) return <p className="text-center text-gray-500">Loading skills...</p>;
  if (isError) return <p className="text-center text-red-500">Error fetching skills.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Skill List</h2>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="mb-5 flex gap-3">
        <input
          type="text"
          placeholder="Enter skill name"
          value={skillname}
          onChange={(e) => setSkillname(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Skill
        </button>
      </form>

      {/* Skills Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3 border border-gray-300">ID</th>
              <th className="p-3 border border-gray-300">Skill Name</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills?.length ? (
              skills.map((skill) => (
                <tr key={skill.skillId} className="hover:bg-gray-100">
                  <td className="p-3 border border-gray-300 text-center">{skill.skillId}</td>
                  <td className="p-3 border border-gray-300 text-center">{skill.skillName}</td>
                  <td className="p-3 border border-gray-300 text-center">
                    <button
                      onClick={() => handleDeleteSkill(skill.skillId)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-2 px-4 text-center text-gray-500">
                  No skills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center text-gray-700">
          Page {page}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={isNextDisabled} // Disable "Next" if no more data
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Skills;
