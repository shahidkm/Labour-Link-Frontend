import React, { useState, ReactNode, useEffect } from 'react';
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { User, LogOut, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfileCompletion } from '../../../Services/User/Authentication/ProfileCheck';
import EmployerProfile from '../../../Pages/User/Employer/EmployerProfile';
import ProfileForm from '../../../Pages/User/Employer/ProfileForm';
import { useLogout } from '../../../Hooks/User/Authentication/LoginHooks';

// SlidePanel Interface
interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

// SlidePanel Component
const SlidePanel: React.FC<SlidePanelProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title = "Profile" 
}) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed right-0 top-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '450px', maxWidth: '100vw' }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close panel"
            type="button"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      
        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 73px)' }}>
          {children}
        </div>
      </div>
    </>
  );
};

// Type for Panel Routes
type PanelRoute = '/show-employer-profile' | '/set-employer-profile' | null;

// Main AccountDropdown Component
const AccountDropdown: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the logout hook correctly
  const logout = useLogout();
  
  // Use the profile completion hook
  const { 
    data: isProfileCompleted, 
    isLoading: isProfileCheckLoading, 
    error: profileCheckError 
  } = useProfileCompletion();

  // State management
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [currentPanelRoute, setCurrentPanelRoute] = useState<PanelRoute>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  // Sync panel state with route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/show-employer-profile' || path === '/set-employer-profile') {
      setCurrentPanelRoute(path as PanelRoute);
      setIsPanelOpen(true);
    } else if (isPanelOpen && currentPanelRoute) {
      setIsPanelOpen(false);
      setCurrentPanelRoute(null);
    }
  }, [location.pathname]);
  
  // Handle profile click based on profile completion
  const handleProfileClick = (): void => {
    if (isProfileCheckLoading || profileCheckError) return;

    const targetRoute: PanelRoute = isProfileCompleted 
      ? '/show-employer-profile' 
      : '/set-employer-profile';
    
    setCurrentPanelRoute(targetRoute);
    setIsPanelOpen(true);
    
    window.history.pushState({}, "", targetRoute);
  };
  
  // Logout handler
  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      
      // Use the logout hook method
      await logout();
      
      // Redirect to login page after successful logout
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally show error toast
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // Close panel and reset route
  const closePanel = (): void => {
    setIsPanelOpen(false);
    
    if (currentPanelRoute) {
      window.history.pushState({}, "", 
        window.location.pathname.replace(currentPanelRoute, ""));
    }
    
    setCurrentPanelRoute(null);
  };
  
  // Render panel content based on route
  const renderPanelContent = () => {
    switch (currentPanelRoute) {
      case '/show-employer-profile':
        return <EmployerProfile />;
      case '/set-employer-profile':
        return <ProfileForm />;
      default:
        return null;
    }
  };
  
  // Get panel title based on route
  const getPanelTitle = (): string => {
    switch (currentPanelRoute) {
      case '/show-employer-profile':
        return 'Employer Profile';
      case '/set-employer-profile':
        return 'Set Up Profile';
      default:
        return 'Profile';
    }
  };
  
  // Loading state
  if (isProfileCheckLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
      </div>
    );
  }

  // Error state
  if (profileCheckError) {
    return (
      <div className="text-red-500 flex items-center gap-2">
        <User className="h-5 w-5" />
        Error loading profile
      </div>
    );
  }
  
  return (
    <>
      <Dropdown>
        <MenuButton>
          <User className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600" />
        </MenuButton>
        <Menu>
          <MenuItem 
            onClick={handleProfileClick}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Profile
          </MenuItem>
          
          <MenuItem 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </MenuItem>
        </Menu>
      </Dropdown>
      
      <SlidePanel 
        isOpen={isPanelOpen} 
        onClose={closePanel}
        title={getPanelTitle()}
      >
        {renderPanelContent()}
      </SlidePanel>
    </>
  );
};

export default AccountDropdown;