import { axiosInstance } from '../../../Services/User/Labour/AxiosInstanse';
import { labourService } from '../../../Services/User/Labour/My-Detailse';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Interface for interest request payload
interface InterestRequestPayload {
  jobPostId: string;
  employerUserId: string;
  employerName: string;
  employerImageUrl?: string;
}

export const useInterestRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InterestRequestPayload) => {
      try {
        // Fetch current labour details before sending the request
        const labourDetails = await labourService.getLabourDetails();
        
        // Create FormData for multipart/form-data
        const formData = new FormData();
        
        // Append all payload fields
        formData.append('JobPostId', payload.jobPostId);
        if (labourDetails.labourName) {
          formData.append('LabourName', labourDetails.labourName);
        }
        if (labourDetails.profilePhotoUrl) {
          // If profilePhotoUrl is a File or Blob, append directly
          // If it's a string URL, you might need to fetch and convert to File
          formData.append('LabourImageUrl', labourDetails.profilePhotoUrl);
        }
        formData.append('EmployerUserId', payload.employerUserId);
        formData.append('EmployerName', payload.employerName);
        
        // Conditionally append optional fields
        if (payload.employerImageUrl) {
          formData.append('EmployerImageUrl', payload.employerImageUrl);
        }
        
        // Append labour details
       
        
        
        // Optional: Append additional labour details
        
        
        // if (labourDetails.skills && labourDetails.skills.length > 0) {
        //   formData.append('labourSkills', JSON.stringify(labourDetails.skills));
        // }

        // Send interest request to API with multipart/form-data
        const response = await axiosInstance.post('https://localhost:7024/api/InterestRequest/show-interest', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        
        return response.data;
      } catch (error: any) {
        // Detailed error handling
        if (error.response) {
          // Server responded with an error status
          const errorMessage = error.response.data;
          toast.error(errorMessage);
          throw new Error(errorMessage);
        } else if (error.request) {
          // Request made but no response received
          toast.error('No response from server. Please check your connection.');
          throw new Error('Network error');
        } else {
          // Error in request setup
          toast.error('An unexpected error occurred');
          throw new Error('Unexpected error');
        }
      }
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success('Interest submitted successfully!');
      
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ['jobPosts'], 
        exact: false 
      });
    },
    onError: (error) => {
      console.error('Interest Request Error:', error);
      // Error toast is already shown in the mutation function
    }
  });
};