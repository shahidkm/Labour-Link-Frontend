import { Plus, Bell, MessageSquare } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import AccounDropdown from "../Dropdown/AccountDropdown";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="py-4 px-4 md:px-6 border-b bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/client-home-page">
          <div className="text-purple-600 font-bold text-xl pointer-cursor">
            Labour Link
          </div>
        </Link>

        {/* Navigation buttons in the middle */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            className="font-medium text-gray-600 hover:text-purple-600 transition"
            onClick={() => navigate("/client-home-page")}
          >
            Home
          </button>
          <button 
            className="font-medium text-gray-600 hover:text-purple-600 transition"
            onClick={() => navigate("/client-home-page")}
          >
            Find Workers
          </button>
          <button 
            className="font-medium text-gray-600 hover:text-purple-600 transition"
            onClick={() => navigate("/posted-job-posts")}
          >
            My Jobs
          </button>
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700 transition"
            onClick={() => navigate("/post-job")}
          >
            Post a Job
          </button>
        </div>

        {/* Icons on the right */}
        <div className="flex items-center space-x-4">
          <Plus 
            className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600 md:hidden" 
            onClick={() => navigate("/post-job")}
          />
          <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600" onClick={()=>navigate("/employer-notifications")}/>
          <MessageSquare className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600" onClick={()=>navigate("/employer-chat")} />
          <AccounDropdown />
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;