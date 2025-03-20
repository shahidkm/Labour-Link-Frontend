// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7202/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const labourService = {
  getLabourProfile: async () => {
    const response = await apiClient.get<LabourProfile>('https://localhost:7202/api/Labour/my-details');
    return response.data;
  },
  
  // Add other labour-related API calls here
  updateLabourProfile: async (profileData: Partial<LabourProfile>) => {
    const response = await apiClient.put<LabourProfile>('/Labour/update-profile', profileData);
    return response.data;
  }
};

// Define the profile data type
export interface LabourProfile {
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
export const defaultProfile: LabourProfile = {
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