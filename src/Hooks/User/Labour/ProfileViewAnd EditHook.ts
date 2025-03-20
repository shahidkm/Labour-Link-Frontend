// src/hooks/useLabourProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labourService,defaultProfile } from '../../../Services/User/Labour/ProfileViewAndEdit';

export const useLabourProfileE = () => {
  const queryClient = useQueryClient();

  const { 
    data: profileData = defaultProfile, 
    isLoading, 
    error, 
    isError 
  } = useQuery({
    queryKey: ['labourProfile'],
    queryFn: labourService.getLabourProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes before refetch
    retry: 1,
  
  });

  const updateProfile = useMutation({
    mutationFn: labourService.updateLabourProfile,
    onSuccess: () => {
      // Invalidate and refetch the profile data after update
      queryClient.invalidateQueries({ queryKey: ['labourProfile'] });
    }
  });

  return {
    profileData,
    isLoading,
    error,
    isError,
    updateProfile: updateProfile.mutate
  };
};