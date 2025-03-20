import axios, { AxiosError, AxiosResponse } from 'axios';

const API_URL: string = 'https://localhost:7299/api/Job/createjobpost';

// Type definitions
export type PreferredTimeType = 'Day' | 'Night' | 'Both';

export interface JobPost {

  Title: string;
  Description: string;
  Wage: number;
  StartDate: string;
  EndDate:string;
  PrefferedTime: PreferredTimeType;
  MuncipalityName: string;
  Skill1Name: string;
  Skill2Name: string;
  image: File | null;
}

export interface Municipality {
  municipalityName: string;
  name: string;
}

// API response type
export interface ApiResponse {
  success: boolean;
  message: string;
  jobId?: number;
}

/**
 * Creates a job post by sending data to the API
 * @param jobData - The job data to be submitted
 * @returns A promise resolving to the API response
 */
export const createJobPost = async (jobData: JobPost): Promise<ApiResponse> => {
  const formData: FormData = new FormData();
  
  // Append all form data to FormData object
  Object.entries(jobData).forEach(([key, value]: [string, any]) => {
    if (key === 'image' && value instanceof File) {
      formData.append('image', value);
    } else if (value !== null && value !== undefined) {
      // Ensure value is properly converted to string
      formData.append(key, value.toString());
    }
  });
  
  try {
    // Enhanced console logging of data being sent
    
    // Create a formatted log of the form data
    const formDataLog: Record<string, any> = {};
    formData.forEach((value, key) => {
      formDataLog[key] = value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value;
    });
    
    console.table(formDataLog);
    
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      API_URL, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      }
    );

    console.log('%c 📥 API Response:', 'background: #10B981; color: white; padding: 2px 4px; border-radius: 4px;');
    console.table(response.data);
    
    return response.data;
  } catch (error: unknown) {
    console.log('%c API Error:', 'background: #EF4444; color: white; padding: 2px 4px; border-radius: 4px;');
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      console.error('API error details:', axiosError.response?.data);
      
      
      
      const errorMessage: string = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.title || 
        axiosError.response?.data || 
        axiosError.message || 
        'Job post creation failed';
      
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    console.error(error);
    throw new Error('An unexpected error occurred');
  }
};