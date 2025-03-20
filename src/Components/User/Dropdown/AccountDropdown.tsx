import React, { useState, ReactNode, useEffect } from 'react';
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useNavigate, useLocation } from "react-router-dom";
import EmployerProfile from '../../../Pages/User/Employer/EmployerProfile';
import ProfileForm from '../../../Pages/User/Employer/ProfileForm';


interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}


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


type PanelRoute = '/show-employer-profile' | '/set-employer-profile' | null;


interface AccountDropdownProps {
 
}

const AccountDropdown: React.FC<AccountDropdownProps> = () => {

  const location = useLocation();
  const {  isProfileCompleted } = useSelector((state: RootState) => state.user);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [currentPanelRoute, setCurrentPanelRoute] = useState<PanelRoute>(null);
  

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
  

  const handleProfileClick = (): void => {
    const targetRoute: PanelRoute = isProfileCompleted 
      ? '/show-employer-profile' 
      : '/set-employer-profile';
    
    setCurrentPanelRoute(targetRoute);
    setIsPanelOpen(true);
    
  
    window.history.pushState({}, "", targetRoute);
  };
  

  const closePanel = (): void => {
    setIsPanelOpen(false);
    
   
    if (currentPanelRoute) {
      window.history.pushState({}, "", 
        window.location.pathname.replace(currentPanelRoute, ""));
    }
    
    setCurrentPanelRoute(null);
  };
  

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
  
  return (
    <>
      <Dropdown>
        <MenuButton>
          <User className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600" />
        </MenuButton>
        <Menu>
          <MenuItem>Account Overview</MenuItem>
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        
          <MenuItem>Logout</MenuItem>
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


export const useProfilePanel = () => {
  const navigate = useNavigate();
  
  const openProfileForm = (): void => {
    navigate('/set-employer-profile');
  };
  
  const openProfileView = (): void => {
    navigate('/show-employer-profile');
  };
  
  return {
    openProfileForm,
    openProfileView
  };
};

export default AccountDropdown;