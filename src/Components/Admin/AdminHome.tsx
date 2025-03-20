import { NavLink, Outlet } from "react-router-dom";
import { 
  FaTachometerAlt, FaUsers, FaUserCog, FaBook, 
  FaServicestack, FaSignOutAlt 
} from "react-icons/fa";

const Home = () => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/users", icon: <FaUsers /> },
    { name: "JobPosts", path: "/jobposts", icon: <FaUserCog /> },
    { name: "Municipalities", path: "/municipalities", icon: <FaBook /> },
    { name: "Skills", path: "/skills", icon: <FaServicestack /> },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white fixed h-full flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
        <nav className="flex flex-col flex-grow">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 text-lg rounded-lg mb-3 w-full cursor-pointer transition-all duration-300 ${
                  isActive ? "bg-gray-700" : "opacity-50 hover:opacity-100"
                }`
              }
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Dynamic Content */}
      <div className="ml-64 p-6 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
