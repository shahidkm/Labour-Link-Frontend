// src/hooks/useJobPosts.ts
import { useQuery } from '@tanstack/react-query';
import { labourService } from '../../../Services/User/Labour/My-Detailse';

import { jobService } from '../../../Services/User/Labour/JobService';

export const useJobPosts = () => {
  const regularJobPosts = useQuery({
    queryKey: ['jobPosts'],
    queryFn: jobService.getActiveJobPosts,
  });

  const preferredJobs = useQuery({
    queryKey: ['preferredJobs'],
    queryFn: jobService.getPreferredJobs,
  });

  const labourDetails = useQuery({ 
    queryKey: ['labourDetails'],
    queryFn: labourService.getLabourDetails,
  });

  return {
    regularJobPosts,
    preferredJobs,
    labourDetails,
  };
};

export const useJobSearch = (title: string) => {
  return useQuery({
    queryKey: ['jobSearch', title],
    queryFn: () => jobService.searchJobsByTitle(title),
    enabled: !!title.trim(),
  });
};