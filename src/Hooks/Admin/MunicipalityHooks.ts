import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMunicipalities,
  addMunicipality,
  deleteMuncipality,
  fetchAllMuncipality,
  fetchMunicipalitiesByState,
} from "../../Services/Admin/MunicipalityServices";
import { fetchSearchMunicipalities } from "../../Services/User/Common/MunicipalityServices";
import toast from "react-hot-toast";

interface Municipality {
  municipalityId: number;
  name: string;
  state?: string;
  isActive: boolean;
}

export const useMunicipalities = (page: number = 1, limit: number = 5) => {
  return useQuery({
    queryKey: ["municipalities", page, limit],
    queryFn: () => fetchMunicipalities(page, limit),
    placeholderData: (previousData) => previousData ?? [],
  });
};

export const useAddMunicipality = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMunicipality,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipalities"] }); 
      toast.success("Municipality added successfully!");
    },
    onError: (error) => {
      console.error("Error adding municipality:", error);
      toast.error("Failed to add municipality");
    },
  });
};

export const useDeleteMunicipality = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMuncipality,
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["municipalities"] });
      toast.success("Municipality deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting municipality:", error);
      toast.error("Failed to delete municipality");
    },
  });
};

export const useMunicipalitySearch = (searchKey: string) => {
  return useQuery({
    queryKey: ["municipalities", searchKey], 
    queryFn: () => fetchSearchMunicipalities(searchKey),
    enabled: !!searchKey, 
    staleTime: 60000, 
  });
};

export const useGetAllMuncipalities = () => {
  return useQuery({
    queryKey: ["allMuncipality"],
    queryFn: () => fetchAllMuncipality(),
  });
};

export const useMunicipalitiesByState = (state: string, page: number, pageSize: number) => {
  return useQuery<{ data: Municipality[]; totalPages: number }>({
    queryKey: ["municipalities", state, page],
    queryFn: () => fetchMunicipalitiesByState(state, page, pageSize),
    enabled: !!state, 
  });
};
