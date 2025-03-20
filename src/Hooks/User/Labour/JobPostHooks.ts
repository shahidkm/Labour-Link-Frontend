
import { useQuery } from "@tanstack/react-query";
import {
  fetchJobPostByTitle,
  fetchClientJobPosts,


} from "../../../Services/User/Labour/JobPostsServices";


import axios from "axios";

export const useFetchClientJobPosts = <T = any>() => {
  return useQuery<T>({
    queryKey: ["jobPosts"],
    queryFn: () => fetchClientJobPosts() as Promise<T>,
  });
};

export const useFetchJobPostById = (jobId: string) => {
  return useQuery({
    queryKey: ["jobPost", jobId], 
    queryFn: async () => {
      console.log("Fetching job post for ID:", jobId);
      const response = await axios.get(`https://localhost:7299/api/Job/getjobpostbyid?id=${jobId}`);
      console.log(response.data);
      
      return response.data.data;
    },
    enabled: !!jobId, 
  });
};
export const useFetchJobPostByTitle = <T = any>(title: string) => {
  return useQuery<T>({
    queryKey: ["jobPost", title],
    queryFn: () => fetchJobPostByTitle(title) as Promise<T>,
    enabled: !!title, 
  });
};


