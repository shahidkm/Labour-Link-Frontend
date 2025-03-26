import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { 
  fetchLabours, 
  fetchPreferredLabours,
  fetchLabourById,
  Labour, 
  labourApi, 
  LabourProfileData, 
  RatingData, 
  Review, 
  ReviewSubmissionData, 
  defaultProfile
} from "../../../Services/User/Employer/LaboursServices";
import toast from "react-hot-toast";
import { FilterLaboursParams,filterLabours } from "../../../Services/User/Employer/LaboursServices";
// Basic labour queries
export const useLabourQuery = () => {
  return useQuery<Labour[], Error>({
    queryKey: ["labours"],
    queryFn: fetchLabours,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};




export const usePreferredLabourQuery = () => {
  return useQuery<Labour[], Error>({
    queryKey: ["preferredLabours"],
    queryFn: fetchPreferredLabours,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};


export const useLabourById = (labourId: string | undefined) => {
  return useQuery({
    queryKey: ["labour", labourId],
    queryFn: async () => {
      if (!labourId) {
        throw new Error("Labour ID is required");
      }
      console.log("Fetching labour details for ID:", labourId);
      return await fetchLabourById(labourId);
    },
    enabled: !!labourId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

// Query keys for consistent cache management
export const queryKeys = {
  labourProfile: (labourId: string) => ['labourProfile', labourId],
  labourRatings: (labourId: string) => ['labourRatings', labourId],
  labourReviews: (labourId: string) => ['labourReviews', labourId],
};

// Profile hook with proper error handling
export const useLabourProfile = (labourId: string | undefined) => {
  return useQuery<LabourProfileData, Error>({
    queryKey: queryKeys.labourProfile(labourId || ''),
    queryFn: async () => {
      if (!labourId) {
        console.warn('No labour ID found in URL');
        return defaultProfile;
      }
      try {
        const profile = await labourApi.getLabourProfile(labourId);
        console.log('Profile data in hook:', profile);
        return profile;
      } catch (error) {
        console.error('Error in useLabourProfile hook:', error);
        toast.error("Failed to load labour profile");
        return defaultProfile;
      }
    },
    enabled: !!labourId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Ratings hook with proper error handling
export const useLabourRatings = (labourId: string | undefined) => {
  return useQuery<RatingData, Error>({
    queryKey: queryKeys.labourRatings(labourId || ''),
    queryFn: async () => {
      if (!labourId) {
        return { data: [0, 0, 0, 0, 0] };
      }
      try {
        const ratings = await labourApi.getLabourRatings(labourId);
        console.log('Ratings data in hook:', ratings);
        return ratings;
      } catch (error) {
        console.error('Error in useLabourRatings hook:', error);
        toast.error("Failed to load ratings");
        return { data: [0, 0, 0, 0, 0] };
      }
    },
    enabled: !!labourId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Reviews hook with proper error handling
export const useLabourReviews = (labourId: string | undefined) => {
  return useQuery<Review[], Error>({
    queryKey: queryKeys.labourReviews(labourId || ''),
    queryFn: async () => {
      if (!labourId) {
        return [];
      }
      try {
        const reviews = await labourApi.getLabourReviews(labourId);
        console.log('Reviews data in hook:', reviews);
        return reviews;
      } catch (error) {
        console.error('Error in useLabourReviews hook:', error);
        toast.error("Failed to load reviews");
        return [];
      }
    },
    enabled: !!labourId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Submit review mutation with proper caching updates
export const useSubmitReview = (queryClient: QueryClient) => {
  return useMutation<void, Error, ReviewSubmissionData>({
    mutationFn: async (reviewData: ReviewSubmissionData) => {
      if (!reviewData.labourId) {
        throw new Error("Labour ID is required");
      }
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error("Valid rating (1-5) is required");
      }
      if (!reviewData.comment.trim()) {
        throw new Error("Comment is required");
      }
      
      return await labourApi.submitReview(reviewData);
    },
    onSuccess: (_data, variables) => {
      console.log('Review submitted successfully, invalidating queries');
      // Invalidate and refetch both reviews and ratings data
      queryClient.invalidateQueries({
        queryKey: queryKeys.labourReviews(variables.labourId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.labourRatings(variables.labourId),
      });
      toast.success("Review submitted successfully");
    },
    onError: (error) => {
      console.error('Review submission error in hook:', error);
      toast.error(error.message || "Failed to submit review");
    }
  });
};


export const useFilterLabours = (params: FilterLaboursParams) => {
  return useQuery({
    queryKey: ['filteredLabours', params],
    queryFn: () => filterLabours(params),
 
  });
};