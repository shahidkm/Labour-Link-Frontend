

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { fetchLabours,Labour } from "../../../Services/User/Employer/LaboursServices";

import {  useMutation, QueryClient } from "@tanstack/react-query";
import { labourApi, LabourProfileData, RatingData, Review, ReviewSubmissionData, defaultProfile } from "../../../Services/User/Employer/LaboursServices";





export const useLabourQuery = () => {
  return useQuery<Labour[], Error>({
    queryKey: ["labours"],
    queryFn: fetchLabours,
  });
};


export const useLabourById = (labourId: string) => {
    return useQuery({
      queryKey: ["labour", labourId], 
      queryFn: async () => {
        console.log("Fetching labour details for ID:", labourId);
        const response = await axios.get(`https://localhost:7202/api/Labour/getLabour?id=${labourId}`);
        return response.data; 
      },
      enabled: !!labourId, 
    });
  };




// Query keys
export const queryKeys = {
  labourProfile: (labourId: string) => ['labourProfile', labourId],
  labourRatings: (labourId: string) => ['labourRatings', labourId],
  labourReviews: (labourId: string) => ['labourReviews', labourId],
};

// Hooks
export const useLabourProfile = (labourId: string | undefined) => {
  return useQuery<LabourProfileData, Error>({
    queryKey: queryKeys.labourProfile(labourId || ''),
    queryFn: () => {
      if (!labourId) {
        console.error('No labour ID found in URL');
        return Promise.resolve(defaultProfile);
      }
      return labourApi.getLabourProfile(labourId);
    },
    enabled: !!labourId,
    staleTime: 5 * 60 * 1000, // 5 minutes
   
  });
};

export const useLabourRatings = (labourId: string | undefined) => {
  return useQuery<RatingData, Error>({
    queryKey: queryKeys.labourRatings(labourId || ''),
    queryFn: () => {
      if (!labourId) {
        return Promise.resolve({ data: [0, 0, 0, 0, 0] });
      }
      return labourApi.getLabourRatings(labourId);
    },
    enabled: !!labourId,
    staleTime: 5 * 60 * 1000, // 5 minutes
   
  });
};

export const useLabourReviews = (labourId: string | undefined) => {
  return useQuery<Review[], Error>({
    queryKey: queryKeys.labourReviews(labourId || ''),
    queryFn: () => {
      if (!labourId) {
        return Promise.resolve([]);
      }
      return labourApi.getLabourReviews(labourId);
    },
    enabled: !!labourId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubmitReview = (queryClient: QueryClient) => {
  return useMutation<void, Error, ReviewSubmissionData>({
    mutationFn: (reviewData: ReviewSubmissionData) => {
      return labourApi.submitReview(reviewData);
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch reviews data
      queryClient.invalidateQueries({
        queryKey: queryKeys.labourReviews(variables.labourId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.labourRatings(variables.labourId),
      });
    },
  });
};