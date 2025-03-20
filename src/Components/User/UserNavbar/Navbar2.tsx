import React, { useState, useEffect } from "react";
import { FaUserCircle, FaComments, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavbarTwo: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`mb-[40px] h-[80px] bg-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrollPosition > 10 ? "shadow-lg" : "shadow-md"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-purple-600 text-xl font-bold tracking-tight relative">
          Labour
          <span className="text-gray-800">Link</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></span>
        </h1>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl text-gray-600 hover:text-purple-600 transition-colors duration-200 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Menu */}
      <div
        className={`absolute md:static top-20 right-4 md:flex md:items-center md:gap-6 bg-white md:bg-transparent ${
          menuOpen 
            ? "flex flex-col gap-4 shadow-lg rounded-lg p-6 border border-gray-100 transition-transform duration-300 ease-in-out transform scale-100" 
            : "hidden md:flex transition-transform duration-300 ease-in-out transform scale-95 md:scale-100"
        }`}
      >
        <button className="relative group p-2 overflow-hidden">
          <FaComments 
            className="cursor-pointer text-gray-600 group-hover:text-purple-600 transition-colors duration-200 z-10 relative" 
            title="Chats" 
            size={24}
          />
          <span className="absolute inset-0 bg-purple-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 z-0"></span>
        </button>
        
        <button 
          className="relative group p-2 overflow-hidden"
          onClick={() => navigate("/profile-settings")}
        >
          <FaUserCircle
            className="cursor-pointer text-gray-600 group-hover:text-purple-600 transition-colors duration-200 z-10 relative"
            title="Profile Settings"
            size={24}
          />
          <span className="absolute inset-0 bg-purple-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 z-0"></span>
        </button>
        
        <button className="relative group p-2 overflow-hidden">
          <FaSignOutAlt 
            className="cursor-pointer text-gray-600 group-hover:text-red-600 transition-colors duration-200 z-10 relative" 
            title="Logout" 
            size={24}
          />
          <span className="absolute inset-0 bg-red-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 z-0"></span>
        </button>
      </div>
    </nav>
  );
};

export default NavbarTwo;