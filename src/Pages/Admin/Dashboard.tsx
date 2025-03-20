import { FaUserFriends} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div>
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          
            {/* <button className="bg-pink-500 text-white px-4 py-2 rounded shadow-md">
              Create New Post
            </button> */}
          
        </div>
      {/* Summary Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 shadow rounded flex items-center gap-4">
                <FaUserFriends className="text-purple-500 text-2xl" />
                <div>
                  <p className="text-gray-600">Users Count</p>
                  <p className="text-xl font-bold">100,000</p>
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded flex items-center gap-4">
                <FaUserFriends className="text-pink-500 text-2xl" />
                <div>
                  <p className="text-gray-600">Labours Count</p>
                  <p className="text-xl font-bold">2,000</p>
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded flex items-center gap-4">
              
                <div>
                  <p className="text-gray-600">Job Posts</p>
                  <p className="text-xl font-bold">5,000</p>
                </div>
              </div>
              {/* <div className="bg-white p-4 shadow rounded flex items-center gap-4">
                <FaBookmark className="text-blue-500 text-2xl" />
                <div> */}
                  {/* <p className="text-gray-600"></p>
                  <p className="text-xl font-bold">800</p> */}
                {/* </div> */}
              {/* </div> */}
            </section>

            {/* Placeholder for charts and statistics */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Most Visited Countries</h3>
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <p>Map Placeholder</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <p>Chart Placeholder</p>
                </div>
              </div>
            </div> */}
            </div>
    
  );
};

export default Dashboard;
