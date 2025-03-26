import React, { useState, useEffect } from "react";
import { FaUserCircle, FaComments, FaSignOutAlt, FaBars, FaTimes, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Search } from 'lucide-react';
import { useLogout } from "../../Hooks/User/Authentication/LoginHooks";

interface NavbarProps {
  searchTitle: string;
  setSearchTitle: (title: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTitle, setSearchTitle }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Get user state from Redux with fallback value
  const user = useSelector((state: RootState) => state.user);
  // Use a fallback value of false if isProfileCompleted is null
  const isProfileCompleted = user.isProfileCompleted === null ? false : user.isProfileCompleted;
  
  console.log("Current user state:", user);
  console.log("isProfileCompleted value (with fallback):", isProfileCompleted);
  
  const logoutMutation = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileNavigation = () => {
    // Since we've already applied a fallback, we can use the value directly
    if (isProfileCompleted) {
      console.log("Navigating to labour profile");
      navigate("/show-labour-profile");
    } else {
      console.log("Navigating to profile settings");
      navigate("/profile-settings");
    }
  };

  const handleNotificationNavigation = () => {
    console.log("Navigating to notifications");
    navigate("/labour-notifications");
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className={`h-20 bg-white py-2 px-6 flex justify-between items-center rounded-lg sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg' : 'shadow-md'
    }`}>
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-purple-600 text-2xl font-bold tracking-tight">
          Labour<span className="text-gray-800">Link</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-72 group">
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Search by Job Title"
          className="p-2 pl-10 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all duration-300 group-hover:shadow-md"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-2xl text-gray-700 hover:text-purple-600 transition-colors duration-200"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200 group" onClick={()=>navigate("/chat")}>
          <FaComments className="text-gray-600 group-hover:text-purple-600 text-lg transition-colors duration-200" title="Chats" />
        </button>
        
        {/* New Notification Button */}
        <button 
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200 group relative"
          onClick={handleNotificationNavigation}
        >
          <FaBell className="text-gray-600 group-hover:text-purple-600 text-lg transition-colors duration-200" title="Notifications" />
          {/* Notification Badge - Uncomment and adjust if you want to show unread count */}
          {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span> */}
        </button>
        
        <button 
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200 group"
          onClick={handleProfileNavigation}
        >
          <FaUserCircle className="text-gray-600 group-hover:text-purple-600 text-lg transition-colors duration-200" title="Profile" />
        </button>
        
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-red-100 transition-colors duration-200 group"
        >
          <FaSignOutAlt className={`text-gray-600 group-hover:text-red-600 text-lg transition-colors duration-200 ${logoutMutation.isPending ? 'animate-spin' : ''}`} title="Logout" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg flex flex-col items-center gap-6 py-6 md:hidden z-10 rounded-b-lg animate-fadeIn">
          <div className="relative w-11/12">
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search by Job Title"
              className="p-2 pl-10 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
          </div>
          
          <div className="flex justify-center gap-8 w-full px-8">
            <button className="flex flex-col items-center gap-1" onClick={()=>navigate("/chat")}>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200">
                <FaComments className="text-gray-600 hover:text-purple-600 text-xl transition-colors duration-200" title="Chats" />
              </div>
            </button>
            
            {/* New Notification Button for Mobile */}
            <button 
              className="flex flex-col items-center gap-1"
              onClick={() => {
                setMenuOpen(false);
                handleNotificationNavigation();
              }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200 relative">
                <FaBell className="text-gray-600 hover:text-purple-600 text-xl transition-colors duration-200" title="Notifications" />
                {/* Notification Badge - Uncomment and adjust if you want to show unread count */}
                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span> */}
              </div>
            </button>
            
            <button 
              className="flex flex-col items-center gap-1"
              onClick={() => {
                setMenuOpen(false);
                handleProfileNavigation();
              }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200">
                <FaUserCircle className="text-gray-600 hover:text-purple-600 text-xl transition-colors duration-200" title="Profile" />
              </div>
            </button>
            
            <button 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 hover:bg-red-100 transition-colors duration-200">
                <FaSignOutAlt className={`text-gray-600 hover:text-red-600 text-xl transition-colors duration-200 ${logoutMutation.isPending ? 'animate-spin' : ''}`} title="Logout" />
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;