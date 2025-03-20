// components/RenderProfile.tsx

import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import { useEmployerDetails2 } from '../../../Hooks/User/Employer/ProfileHook';
import { Avatar, AvatarFallback, AvatarImage } from '../../../Components/Ui/Avatar';

interface RenderProfileProps {
  onEditClick: () => void;
}

export const RenderProfile: React.FC<RenderProfileProps> = ({ onEditClick }) => {
  const { data, isLoading, isError } = useEmployerDetails2();
  
  const getInitials = (name: string | null): string => {
    if (!name || name === "Not Available") return 'U';
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading profile</div>;

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={data.profileImageUrl} alt={data?.fullName || 'User'} />
          <AvatarFallback className="text-xl bg-purple-100 text-purple-700">
            {data?.fullName ? getInitials(data.fullName) : 'U'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{data?.fullName || 'User'}</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="text-purple-600" size={20} />
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{data?.fullName || 'Not Available'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="text-purple-600" size={20} />
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">{data?.phoneNumber || 'Not Available'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="text-purple-600" size={20} />
          <div>
            <p className="text-sm text-gray-500">Preferred Municipality</p>
            <p className="font-medium">{data?.preferedMunicipality || 'Not Available'}</p>
          </div>
        </div>
      </div>
      
      <button 
        className="mt-6 w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        onClick={onEditClick}
      >
        Edit Profile
      </button>
    </>
  );
};
