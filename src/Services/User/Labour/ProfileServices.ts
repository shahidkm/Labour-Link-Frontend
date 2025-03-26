import axios from "axios";



export interface ProfileDetails {
  FullName: string;
  PhoneNumber: string;
  PreferedTime: string;
  AboutYourSelf: string;
  ProfileImage: File | null; 
  LabourPreferredMunicipalities: string[];
  LabourWorkImages: File[];
  LabourSkills: string[];
}

export const AddProfile = async (Profile: ProfileDetails): Promise<ProfileDetails> => {
  console.log("Sending data:", Profile);
  
  try {
    // Create FormData for handling file uploads
    const formData = new FormData();
    
    // Append text fields
    formData.append("FullName", Profile.FullName);
    formData.append("PhoneNumber", Profile.PhoneNumber);
    formData.append("PreferedTime", Profile.PreferedTime);
    formData.append("AboutYourSelf", Profile.AboutYourSelf);
    
    // Append arrays (municipalities and skills)
    Profile.LabourPreferredMunicipalities.forEach((municipality, index) => {
      formData.append(`LabourPreferredMunicipalities[${index}]`, municipality);
    });
    
    Profile.LabourSkills.forEach((skill, index) => {
      formData.append(`LabourSkills[${index}]`, skill);
    });
    
    // Append profile image if it exists
    if (Profile.ProfileImage) {
      formData.append("ProfileImage", Profile.ProfileImage);
    }
    
    // Append work images
    Profile.LabourWorkImages.forEach((image, index) => {
      formData.append(`LabourWorkImages[${index}]`, image);
    });
    
    const response = await axios.post(
      "https://local", 
      formData,
      
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      }
    );
    
    console.log("Response data:", response.data);
    return response.data;
  } catch (ex) {
    console.error("Error in AddProfile:", ex);
    throw ex; // Re-throw the exception to be handled by the caller
  }
};







  

  const api = axios.create({
    baseURL: 'https://localhost:7202/api',
    withCredentials: true, // Enable sending cookies with requests
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  export interface UpdateProfileData {
    FullName: string;
    PreferedTime: string;
    AboutYourSelf: string;
    Image: File | null;
  }
  
  export const updateProfile = async (data: UpdateProfileData) => {
    const formData = new FormData();
    formData.append("FullName", data.FullName);
    formData.append("PreferedTime", data.PreferedTime)
    formData.append("AboutYourSelf", data.AboutYourSelf);
   ;
    
    if (data.Image) {
      formData.append("image", data.Image);
    }
    
    const response = await api.patch("/Labour/edit/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    return response.data;
  };
  
  // Define the shape of the data returned by the API
  export interface LabourProfile {
    labourId: string;
    labourProfileCompletion: {
      fullName: string;
      phoneNumber: string;
      preferredTime: string;
      aboutYourSelf: string;
    };
    profilePhotoUrl: string;
    labourWorkImages: string[];
    labourPreferredMuncipalities: number[];
    labourSkills: string[];
  }
  
  // Export both versions of the function name for backward compatibility
  export const getLabourProfil = async (): Promise<LabourProfile> => {
    try {
      const response = await api.get<LabourProfile>("/Labour/getLabour");
      return response.data;
    } catch (error) {
      console.error("Error fetching labour profile:", error);
      throw error;
    }
  };
  
  export const getLabourProfile = getLabourProfil; // Alias
  
  // Service function to delete a work image by its URL
  export const deleteWorkImage = async (WorkImage: string): Promise<void> => {
    await api.delete("/Labour/delete/workimage", {
      data: { WorkImage }
    });
  };
  
  // Service function to delete a skill by skill ID
  export const deleteSkill = async (skillName: string): Promise<void> => {
    await api.delete("/Labour/delete/skill", {
      data: { skillName }
    });
  };
  
  // Service function to delete a municipality by municipality ID
  export const deleteMunicipality = async (municipalityId: number): Promise<void> => {
    await api.delete("/Labour/delete/municipality", {
      data: { municipalityId }
    });
  };
  
  // Service function to add a municipality by municipality ID
  export const addMunicipality = async (municipalityId: number): Promise<void> => {
    await api.post("/Labour/add/municipality", { municipalityId });
  };
  
  // Service function to add a skill by skill ID
  export const addSkill = async (skillId: string): Promise<void> => {
    await api.post("/Labour/add/skill", { skillId }); // Fixed the typo in the endpoint from "aad" to "add"
  };
  
  // Service function to add a work image (image file)
  export const addWorkImage = async (imageFile: File): Promise<void> => {
    const formData = new FormData();
    formData.append("image", imageFile);
  
    await api.post("/Labour/add/workimage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };