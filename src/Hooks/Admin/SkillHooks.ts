import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSkills,
  addSkill,
  deleteSkill,
} from "../../Services/Admin/SkillServices";
import {
  fetchAllSkill,
  fetchSearchSkills,
  postAJob,
} from "../../Services/User/Common/SkillServices";
import toast from "react-hot-toast";

export interface Skills {
  skillId: string;
  skillName: string;
}

export const useGetSkills = (page: number, limit: number = 5) => {
  return useQuery({
    queryKey: ["Skill", page],
    queryFn: () => fetchSkills(page, limit),
    placeholderData: (previousData) => previousData ?? [],
  });
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Skill"] }); 
      toast.success("Skill added successfully!");
    },
    onError: (error) => {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Skill"] }); 
      toast.success("Skill deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    },
  });
};

export const useSkillSearch = (searchParams: string) => {
  return useQuery({
    queryKey: ["skills", searchParams], 
    queryFn: () => fetchSearchSkills(searchParams),
    enabled: !!searchParams, 
    staleTime: 60000,
  });
};

export const useGetAllSkill = () => {
  return useQuery({
    queryKey: ["allSkill"],
    queryFn: () => fetchAllSkill(),
  });
};

export const usePostJob = () => {
  return useMutation({
    mutationFn: postAJob,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Job posted successfully!");
     
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post job");
    },
  });
};
