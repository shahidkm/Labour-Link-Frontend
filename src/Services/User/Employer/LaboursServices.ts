import axios, { AxiosResponse } from "axios";

export interface Labour {
  labourId: string;
  labourName: string;
  profilePhotoUrl: string | null;
  rating: number | null;
  labourSkills: string | null;
  labourPreferredMuncipalities: string;
}


export interface Labours {

 
  LabourId : string;
  LabourName: string;
  
  PhoneNumber: string;
  PreferedTime: string;
  Rating: number;
  ProfilePhotoUrl: string;
  AboutYourSelf : string;



  LabourWorkImages: string[] | null;
  LabourPreferredMuncipalities: number[] | null;
  LabourSkills: string[] | null;
  Reviews: string | null;
}


axios.defaults.withCredentials = true; 

export const fetchLabours = async (): Promise<Labour[]> => {
  try {
    const response = await axios.get("https://localhost:7202/api/Labour/all/lLabours");
    return response.data;
  } catch (error: any) {
    throw new Error(error?.message || "Error fetching labours");
  }
};


  export const fetchLabourById = async (id: string): Promise<Labour> => {
    try {
      const { data } = await axios.get(`https://localhost:7202/api/Labour/getLabour?id=`, {
        params: { id },
      });
      console.log(`Job Post with ID ${id}:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching job post with ID ${id}:`, error);
      throw new Error("Failed to fetch job post");
    }
  };


  









// Types
export interface LabourProfileCompletion {
  fullName: string;
  phoneNumber: string;
  preferedTime: string;
  aboutYourSelf: string;
}

export interface LabourProfileData {
  profilePhotoUrl: string;
  labourProfileCompletion: LabourProfileCompletion;
  labourSkills: string[];
  labourPreferredMuncipalities: string[];
  labourWorkImages: string[];
  labourName?: string;
  phoneNumber?: string;
  preferedTime?: string;
  aboutYourSelf?: string;
}

export interface Review {
  rating: number;
  comment: string;
  image: string;
  fullName: string;
  updatedAt: string;
}

export interface RatingData {
  data: number[];
}

export interface ReviewSubmissionData {
  labourId: string;
  rating: number;
  comment: string;
  image: File | null;
}

// Default profile data
export const defaultProfile: LabourProfileData = {
  profilePhotoUrl: "https://tse1.mm.bing.net/th?id=OIP.vLFXcRTQ2qrcvcQH0byB2gHaHa&pid=Api&P=0&h=180",
  labourProfileCompletion: {
    fullName: "John Doe",
    phoneNumber: "Not Available",
    preferedTime: "Not Specified",
    aboutYourSelf: "No description available.",
  },
  labourSkills: ["No skills listed"],
  labourPreferredMuncipalities: ["No preferred municipalities"],
  labourWorkImages: [
    "https://tse4.mm.bing.net/th?id=OIP.HCeLYeygAEGjxXB9WqSjLQHaEe&pid=Api&P=0&h=180",
    "https://tse4.mm.bing.net/th?id=OIP.nE8oS0bt_ojpKkqRw7jUeAHaE8&pid=Api&P=0&h=180",
    "https://tse3.mm.bing.net/th?id=OIP.rEQO5je6BwQlrJOgHv1RKAHaE8&pid=Api&P=0&h=180",
    "https://tse3.mm.bing.net/th?id=OIP.eCeU8PLZOWUGJOcOO1gxuwHaE8&pid=Api&P=0&h=180"
  ],
  labourName: "John Doe",
  phoneNumber: "Not Available",
  preferedTime: "Not Specified",
  aboutYourSelf: "No description available."
};

// API URL constants
const BASE_URL = "https://localhost:7202";

// Labour API Service
export const labourApi = {
  getLabourProfile: async (labourId: string): Promise<LabourProfileData> => {
    try {
      const response: AxiosResponse<LabourProfileData> = await axios.get(
        `${BASE_URL}/api/Labour/getLabour`, 
        {
          params: { id: labourId },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('Unauthorized! Redirecting to login...');
        // Handle logout or redirect to login page if needed
      }
      throw error;
    }
  },

  getLabourRatings: async (labourId: string): Promise<RatingData> => {
    try {
      const response: AxiosResponse<RatingData> = await axios.get(
        `${BASE_URL}/api/Review/getreviewbyeachrating`,
        {
          params: { LabourId: labourId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
  },

  getLabourReviews: async (labourId: string): Promise<Review[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Review/getreviewsofspecificlabour`,
        {
          params: { Labourid: labourId },
        }
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  submitReview: async (reviewData: ReviewSubmissionData): Promise<void> => {
    const formData = new FormData();
    formData.append("LabourId", reviewData.labourId);
    formData.append("Rating", reviewData.rating.toString());
    formData.append("Comment", reviewData.comment);
    
    if (reviewData.image) {
      formData.append("Image", reviewData.image);
    }

    try {
      await axios.post(
        `${BASE_URL}/api/Review/postreview`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
    } catch (error) {
      console.error("Review submission error:", error);
      throw error;
    }
  }
};