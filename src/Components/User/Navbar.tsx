import React, { useState, useEffect } from "react";
import { FaUserCircle, FaComments, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
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
  const { isProfileCompleted } = useSelector((state: RootState) => state.user);
  const logoutMutation = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200 group">
          <FaComments className="text-gray-600 group-hover:text-purple-600 text-lg transition-colors duration-200" title="Chats" />
        </button>
        
        <button 
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200 group"
          onClick={() => {
            if (isProfileCompleted) {
              navigate("/labour-profile");
            } else {
              navigate("/profile-settings");
            }
          }}
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
            <button className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors duration-200">
                <FaComments className="text-gray-600 hover:text-purple-600 text-xl transition-colors duration-200" title="Chats" />
              </div>
            
            </button>
            
            <button 
              className="flex flex-col items-center gap-1"
              onClick={() => {
                setMenuOpen(false);
                if (isProfileCompleted) {
                  navigate("/labour-profile");
                } else {
                  navigate("/profile-settings");
                }
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
