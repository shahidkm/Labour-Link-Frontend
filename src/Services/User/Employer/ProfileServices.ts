import axios from "axios";

axios.defaults.withCredentials = true; // Make sure credentials are sent with requests

export const getEmployerDetails = async () => {
  try {
    const response = await axios.get('https://localhost:7202/api/Employer/my-details');
    return response.data;
  } catch (error) {
    console.error("API call failed, using default data", error);
    return {
      fullName: "Not Available",
      phoneNumber: "Not Available",
      profileImageUrl: "https://tse1.mm.bing.net/th?id=OIP.417hL7160FM_SF4dAydN1QHaEo&pid=Api&P=0&h=180",
      preferedMunicipality: "Not Available"
    };
  }
};

export const updateEmployerProfile = async (data: any) => {
  try {
    const response = await axios.patch('https://localhost:7202/api/Employer/edit/Profile', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update profile');
  }
};






export interface AddEmployerProfileData {
  FullName: string;
  PhoneNumber: string;
  PreferedMunicipality: string;
  ProfileImage:File
}

const API_URL = "https://localhost:7202/api/Employer/Complte/Profile";

// Function to add employer profile
export const addEmployerProfile = async (data: AddEmployerProfileData) => {
  try {
    const formData = new FormData();
    formData.append("FullName", data.FullName);
    formData.append("PhoneNumber", data.PhoneNumber);
    formData.append("PreferedMunicipality", data.PreferedMunicipality);
    formData.append("ProfileImage", data.ProfileImage);

    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding employer profile:", error);
    throw error;
  }
};

export interface EmployerDetails {
  fullName: string;
  phoneNumber: string;
  preferedMunicipality: string;
  profileImageUrl: string;
}




export const fetchEmployerDetails = async (): Promise<EmployerDetails> => {
  try {
    const response = await axios.get("https://localhost:7202/api/Employer/my-details", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employer details:", error);
    throw error;
  }
};