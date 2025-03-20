import { useQuery } from "@tanstack/react-query";
import { fetchJobs,JobPost } from "../../../Services/User/Employer/PostedJobPosts";
import { useMutation } from "@tanstack/react-query";
import { JobUpdateData,updateJob } from "../../../Services/User/Employer/PostedJobPosts";
import toast from "react-hot-toast";
export const useJobs = () => {
  return useQuery<JobPost[], Error>({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    staleTime: 1000 * 60 * 5, 
    initialData: [] 
  });
};


interface UpdateJobParams {
    jobId: string;
    jobData: JobUpdateData;
  }
  
  export const useUpdateJob = () => {
    return useMutation({
      mutationFn: async ({ jobId, jobData }: UpdateJobParams) => {
        return await updateJob(jobId, jobData);
      },
      onSuccess: () => {
        toast.success("Job post updated successfully!");
      },
      onError: (error) => {
        toast.error(`Failed to update job: ${error instanceof Error ? error.message : "Unknown error"}`);
      },
    });
  };