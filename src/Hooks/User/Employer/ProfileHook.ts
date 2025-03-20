


import { AddEmployerProfileData,addEmployerProfile } from "../../../Services/User/Employer/ProfileServices";
import { fetchEmployerDetails,EmployerDetails } from "../../../Services/User/Employer/ProfileServices";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployerDetails, updateEmployerProfile} from '../../../Services/User/Employer/ProfileServices';
import { useDispatch } from 'react-redux';
import { updateProfileCompletion } from "../../../Redux/userSlice";
export const useEmployerDetails = () => {
  return useQuery({
    queryKey: ['employerDetails'],
    queryFn: getEmployerDetails,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: {
      fullName: "Not Available",
      phoneNumber: "Not Available",
      profileImageUrl: "https://tse1.mm.bing.net/th?id=OIP.417hL7160FM_SF4dAydN1QHaEo&pid=Api&P=0&h=180",
      preferedMunicipality: "Not Available"
    }
  });
};

export const useUpdateEmployerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerDetails'] });
    }
  });
};




export const useAddEmployerProfile = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: (data: AddEmployerProfileData) => addEmployerProfile(data),
    onSuccess: () => {
      // Update the profile completion status to true upon successful profile addition
      dispatch(updateProfileCompletion(true));
    }
  });
};




export const useEmployerDetails2 = () => {
  return useQuery<EmployerDetails, Error>({
    queryKey: ["employerDetails2"],  // A unique key for caching the query
    queryFn: fetchEmployerDetails,  // The service function to fetch data
    staleTime: 1000 * 60 * 5,  // Cache for 5 minutes
    refetchOnWindowFocus: false,  // Disable refetch on window focus
  });
};