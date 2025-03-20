import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import UserNavbar from '../../../Components/User/UserNavbar/EmployerNavbar';

// Define the profile data type
interface LabourProfile {
  profilePhotoUrl: string;
  labourProfileCompletion: {
    fullName: string;
    phoneNumber: string;
    preferedTime: string;
    aboutYourSelf: string;
  };
  labourSkills: string[];
  labourPreferredMuncipalities: string[];
  labourWorkImages: string[];
}

// Define default values for when API fails
const defaultProfile: LabourProfile = {
  profilePhotoUrl: '/default-avatar.png',
  labourProfileCompletion: {
    fullName: 'User Name',
    phoneNumber: 'Not available',
    preferedTime: 'Not specified',
    aboutYourSelf: 'No information provided'
  },
  labourSkills: [],
  labourPreferredMuncipalities: [],
  labourWorkImages: []
};

const LabourProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  // API client setup with credentials
  const apiClient = axios.create({
    baseURL: 'https://localhost:7202/api',
    withCredentials: true,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  // React Query hook implementation
  const { data, isLoading, isError } = useQuery({
    queryKey: ['labourProfile'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<LabourProfile>('/Labour/my-details');
        return response.data;
      } catch (error) {
        console.error('Error fetching profile data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes before refetch
    retry: 1
  });
  
  // Show loading state
  if (isLoading) return <div className="flex justify-center items-center h-screen text-gray-600 text-sm">Loading...</div>;
  
  // Show error state
  if (isError) return <div className="flex justify-center items-center h-screen text-red-600 text-sm">Error loading profile data. Please try again later.</div>;

  // Ensure we have valid data
  const profileData = data || defaultProfile;
  const completion = profileData.labourProfileCompletion || defaultProfile.labourProfileCompletion;
  
  return (
    <div className="bg-white-100 min-h-screen overflow-hidden text-xs">
      <UserNavbar/>
      <div className="mt-8 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-md max-w-[1500px] w-full p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex flex-col items-center border-r p-4">
              <img
                src={profileData.profilePhotoUrl || defaultProfile.profilePhotoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = defaultProfile.profilePhotoUrl;
                }}
              />
              <h2 className="text-lg font-bold text-gray-800 mt-2">
                {completion.fullName || defaultProfile.labourProfileCompletion.fullName}
              </h2>
              <p className="text-gray-600 text-xs">
                {completion.phoneNumber || defaultProfile.labourProfileCompletion.phoneNumber}
              </p>
              <div className="mt-2 flex justify-center w-full">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600" onClick={() => navigate("/edit-labour-profile")}>Edit</button>
              </div>
            </div>
            <div className="w-full md:w-2/3 p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Profile Details</h2>
              <p className="text-gray-600 text-xs mb-2">
                <strong>Preferred Time:</strong> {completion.preferedTime || defaultProfile.labourProfileCompletion.preferedTime}
              </p>
              <p className="text-gray-700 text-xs mb-3">
                <strong>About:</strong> {completion.aboutYourSelf || defaultProfile.labourProfileCompletion.aboutYourSelf}
              </p>

              <h3 className="text-sm font-semibold text-gray-800 mb-2">Core Skills</h3>
              <ul className="flex flex-wrap gap-1 mb-3">
                {Array.isArray(profileData.labourSkills) && profileData.labourSkills.length > 0 ? (
                  profileData.labourSkills.map((skill: string, index: number) => (
                    <li key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {skill}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600 text-xs">No skills listed</li>
                )}
              </ul>

              <h3 className="text-sm font-semibold text-gray-800 mb-2">Preferred Municipalities</h3>
              <ul className="flex flex-wrap gap-1 mb-3">
                {Array.isArray(profileData.labourPreferredMuncipalities) && profileData.labourPreferredMuncipalities.length > 0 ? (
                  profileData.labourPreferredMuncipalities.map((municipality: string, index: number) => (
                    <li key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {municipality}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600 text-xs">No municipalities listed</li>
                )}
              </ul>
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 text-center">
            Work Images
          </h3>
          <div className="flex justify-center px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.isArray(profileData.labourWorkImages) && profileData.labourWorkImages.length > 0 ? (
                profileData.labourWorkImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="w-full max-w-[220px] h-[150px] flex justify-center items-center bg-gray-100 rounded-lg shadow-md overflow-hidden mx-auto"
                  >
                    <img
                      src={image}
                      alt={`Work ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center col-span-full">No work images available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourProfilePage;