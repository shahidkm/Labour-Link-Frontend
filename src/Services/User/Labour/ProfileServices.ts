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
      "https://localhost:7202/api/Labour/complete-profile", 
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



export interface UpdateProfileData {
    FullName: string;
    PreferedTime: string;
    AboutYourSelf: string;
    Image: File | null;
   
  }
  
  export const updateProfile = async (data: UpdateProfileData) => {
    const formData = new FormData();
    formData.append("FullName", data.FullName);
    formData.append("AboutYourSelf", data.AboutYourSelf);
    if (data.Image) {
      formData.append("Image", data.Image);
    }
    formData.append("preferredTime", data.PreferedTime);
    console.log(formData);
      
    const response = await axios.patch("https://localhost:7202/api/Labour/edit/profile", formData, {
     
      headers: { "Content-Type": "multipart/form-data" },

      
      
    });
    console.log(response.data);
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




export const getLabourProfil = async (): Promise<LabourProfile> => {
  try {
    const response = await axios.get<LabourProfile>("https://localhost:7202/api/Labour/getLabour");
    console.log("Labour Profile Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching labour profile:", error);
    throw error;
  }
};


// Service function to delete a work image by its URL
export const deleteWorkImage = async (imageUrl: string): Promise<void> => {
  const response = await fetch("https://localhost:7202/api/Labour/delete/workimage", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete work image");
  }
};

// Service function to delete a skill by skill ID
export const deleteSkill = async (skillId: string): Promise<void> => {
  const response = await fetch("https://localhost:7202/api/Labour/delete/skill", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skillId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete skill");
  }
};

// Service function to delete a municipality by municipality ID
export const deleteMunicipality = async (municipalityId: number): Promise<void> => {
  const response = await fetch("https://localhost:7202/api/Labour/delete/municipality", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ municipalityId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete municipality");
  }
};

// Service function to add a municipality by municipality ID
export const addMunicipality = async (municipalityId: number): Promise<void> => {
  const response = await fetch("https://localhost:7202/api/Labour/add/municipality", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ municipalityId }),
  });

  if (!response.ok) {
    throw new Error("Failed to add municipality");
  }
};

// Service function to add a skill by skill ID
export const addSkill = async (skillId: string): Promise<void> => {
  const response = await fetch("https://localhost:7202/api/Labour/add/skill", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skillId }),
  });

  if (!response.ok) {
    throw new Error("Failed to add skill");
  }
};

// Service function to add a work image (image file)
export const addWorkImage = async (imageFile: File): Promise<void> => {
  const formData = new FormData();
  formData.append("image", imageFile); // Ensure this key matches your backend's "image"

  try {
    const response = await fetch("https://localhost:7202/api/Labour/add/workimage", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding work image:", errorData);
      throw new Error(errorData.title || "Failed to add work image");
    }

    console.log("Work image added successfully!");
  } catch (error) {
    console.error("Upload failed:", error);
  }
};


