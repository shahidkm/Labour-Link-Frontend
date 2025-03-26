import { useQuery } from '@tanstack/react-query';
import { authServiceCheck } from './LoginServices';

export const useProfileCompletion = () => {
  return useQuery({
    queryKey: ['profileCompletion'],
    queryFn: authServiceCheck.isProfileCompleted,
    retry: 1, // Retry once on failure
    staleTime: 1000 * 60 * 5, // 5 minutes of cache time
    refetchOnWindowFocus: false,
  });
};