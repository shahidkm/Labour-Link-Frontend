import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import axios from "axios";

export interface JobPost {
  id: number;
  ClientId: number;
  name: string;
  Description: string;
  Wage: number;
  StartDate: Date;
  PreferredTime: string;
  MunicipalityId: number;
  Status: string;
  WorkImageUrl: string;
  CreateAt: Date;
}


export const fetchJobPosts = async (): Promise<JobPost[]> => {
  const { data } = await axios.get<JobPost[]>("https://localhost:7299/api/Job/showallJobpostactive");
  console.log(data);
  
  return data;
};


export const deleteJobPost = async (id: number) => {
  await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return id;
};


export const useJobPosts = () => {
  return useQuery({
    queryKey: ["JobPosts"],
    queryFn: () => fetchJobPosts(),
    placeholderData: (previousData) => {
      return previousData; 
    },
  });
};


export const useDeleteJobPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJobPost,
    onSuccess: (deletedJobPostId) => {
      
      queryClient.setQueryData<JobPost[]>(["JobPosts"], (oldJobPosts = []) =>
        oldJobPosts.filter((jobPosts) => jobPosts.id !== deletedJobPostId)
      );

      
      queryClient.invalidateQueries({ queryKey: ["JobPosts"] });
    },
    onError: (error) => {
      console.error("Error deleting job post:", error);
    },
  });
};


