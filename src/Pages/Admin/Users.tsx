import { useState } from "react";
import { useUsers } from "../../Hooks/Admin/UserHooks";

const Users: React.FC = () => {
  const [userIdSearch, setUserIdSearch] = useState<number | string>(""); 
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all"); 
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">Error loading users</p>;

  // Filter users based on search and user type
  const filteredUsers = users?.filter((user) => {
    const matchesIdSearch = user.labourId.toString().includes(userIdSearch.toString());
    // Filtering by userTypeFilter (currently it's not being used)
    // const matchesUserType = userTypeFilter === "all" || user.type === userTypeFilter;
    return matchesIdSearch; // && matchesUserType; // Uncomment if you want to include the filter
  });

  return (
    <div className="p-6 bg-blue-50 rounded-lg shadow-lg">
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Labour ID"
          className="px-4 py-3 border border-blue-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userIdSearch}
          onChange={(e) => setUserIdSearch(e.target.value)}
        />
      
        <select
          value={userTypeFilter}
          onChange={(e) => setUserTypeFilter(e.target.value)}
          className="px-4 py-3 border border-blue-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All User Types</option>
          <option value="client">Client</option>
          <option value="labour">Labour</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-md shadow-md">
        <table className="min-w-full text-left w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="bg-gray-800 px-2 border w-20">LabourId</th>
              <th className="bg-gray-800 px-2 border w-32">Labour Name</th>
              <th className="bg-gray-800 px-2 border w-32">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.length ? (
              filteredUsers.map((user) => (
                <tr key={user.labourId} className="border-b hover:bg-blue-50">
                  <td className="py-1 px-2">{user.labourId}</td>
                  <td className="py-1 px-2">{user.labourName}</td>
                  <td className="py-1 px-2">{user.phoneNumber}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-2 px-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
