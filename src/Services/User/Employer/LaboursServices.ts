import axios, { AxiosResponse } from "axios";

export interface Labour {
  labourId: string;
  userId:string;
  labourName: string;
  profilePhotoUrl: string | null;
  rating: number | null;
  labourSkills: string | null;
  labourPreferredMuncipalities: string;
}

export interface Labours {
  LabourId: string;
  LabourName: string;
  PhoneNumber: string;
  PreferedTime: string;
  Rating: number;
  ProfilePhotoUrl: string;
  AboutYourSelf: string;
  LabourWorkImages: string[] | null;
  LabourPreferredMuncipalities: number[] | null;
  LabourSkills: string[] | null;
  Reviews: string | null;
}

axios.defaults.withCredentials = true; 

export const fetchLabours = async (): Promise<Labour[]> => {
  try {
    const response = await axios.get("https://localhost:7202/api/Labour/all/Labours");
    return response.data;
  } catch (error: any) {
    throw new Error(error?.message || "Error fetching labours");
  }
};



export const fetchPreferredLabours = async (): Promise<Labour[]> => {
  try {
    const response = await axios.get("https://localhost:7202/api/Preffered/getthelabourbyemployer");
    return response.data;
  } catch (error: any) {
    throw new Error(error?.message || "Error fetching preferred labours");
  }
};

export const fetchLabourById = async (id: string): Promise<Labour> => {
  try {
    const { data } = await axios.get(`https://localhost:7202/api/Labour/getLabour`, {
      params: { id },
    });
    console.log(`Labour with ID ${id}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching labour with ID ${id}:`, error);
    throw new Error("Failed to fetch labour details");
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
      // FIXED: Proper structure for API call
      // Option 1: If API expects a POST with the ID in the body
      const response: AxiosResponse<LabourProfileData> = await axios.post(
        `${BASE_URL}/api/Labour/labour-by-id`,
        { id: labourId }, // ID directly in request body
        { withCredentials: true } // Config as third parameter
      );
      console.log(response);
      
      // Option 2: Uncomment this if your API actually expects a GET request
      // const response: AxiosResponse<LabourProfileData> = await axios.get(
      //   `${BASE_URL}/api/Labour/labour-by-id`,
      //   {
      //     params: { id: labourId },
      //     withCredentials: true
      //   }
      // );
      
      console.log('Labour profile data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
        if (error.response?.status === 401) {
          console.warn('Unauthorized! Redirecting to login...');
          // Handle logout or redirect to login page if needed
        }
      }
      return defaultProfile; // Return default profile on error
    }
  },

  getLabourRatings: async (labourId: string): Promise<RatingData> => {
    try {
      console.log('Fetching ratings for labour ID:', labourId);
      const response: AxiosResponse<RatingData> = await axios.get(
        `${BASE_URL}/api/Review/getreviewbyeachrating`,
        {
          params: { LabourId: labourId }, // Ensure correct parameter case
        }
      );
      console.log('Ratings data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching ratings:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
      }
      return { data: [0, 0, 0, 0, 0] }; // Return default ratings on error
    }
  },

  getLabourReviews: async (labourId: string): Promise<Review[]> => {
    try {
      console.log('Fetching reviews for labour ID:', labourId);
      const response = await axios.get(
        `${BASE_URL}/api/Review/getreviewsofspecificlabour`,
        {
          params: { Labourid: labourId }, // Ensure correct parameter case
        }
      );
      console.log('Reviews data received:', response.data);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
      }
      return []; // Return empty array on error
    }
  },

  submitReview: async (reviewData: ReviewSubmissionData): Promise<void> => {
    const formData = new FormData();
    // FIXED: Ensure parameter names match API expectations
    formData.append("LabourId", reviewData.labourId); // Capitalized as expected by API
    formData.append("Rating", reviewData.rating.toString());
    formData.append("Comment", reviewData.comment);
    
    if (reviewData.image) {
      formData.append("Image", reviewData.image);
    }

    console.log('Submitting review with data:', {
      labourId: reviewData.labourId,
      rating: reviewData.rating,
      commentLength: reviewData.comment.length,
      hasImage: !!reviewData.image
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/Review/postreview`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
      console.log('Review submission successful:', response.data);
    } catch (error) {
      console.error("Review submission error:", error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
      }
      throw error;
    }
  }
};



export interface FilterLaboursParams {
  preferredMunicipalities?: string[];
  skills?: string[];
}

const API_BASE_URL = 'https://localhost:7202/api';

export const filterLabours = async (params: FilterLaboursParams): Promise<Labour[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Labour/filter/labours`, params);
    return response.data;
  } catch (error) {
    console.error('Error filtering labours:', error);
    throw error;
  }
};