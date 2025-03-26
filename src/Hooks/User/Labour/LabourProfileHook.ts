import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  AddProfile, 
  ProfileDetails, 
  UpdateProfileData, 
  updateProfile, 
  getLabourProfile,
  deleteMunicipality,
  deleteWorkImage,
  deleteSkill,
  addMunicipality,
  addSkill,
  addWorkImage,
  LabourProfile
} from "../../../Services/User/Labour/ProfileServices";
import { useDispatch } from 'react-redux';
import { updateProfileCompletion } from "../../../Redux/userSlice";
// Custom hook for adding a profile
export const useAddProfile = () => {
  const dispatch = useDispatch();
  
  return useMutation<ProfileDetails, Error, ProfileDetails>({
    mutationFn: AddProfile,
    onSuccess: () => {
      // Update the profile completion status to true upon successful profile addition
      dispatch(updateProfileCompletion(true));
    }
  });
};
// Custom hook for updating a profile
export const useUpdateProfile = () => {
  return useMutation<unknown, Error, UpdateProfileData>({
    mutationFn: updateProfile,
  });
};

// Custom hook for fetching labour profile using React Query
export const useLabourProfile = () => {
  return useQuery<LabourProfile, Error>({
    queryKey: ["labourProfile"],
    queryFn: getLabourProfile,
  });
};

export const useDeleteWorkImage = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteWorkImage,
  });
};

// Hook for deleting a skill
export const useDeleteSkill = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteSkill,
  });
};

// Hook for deleting a municipality
export const useDeleteMunicipality = () => {
  return useMutation<void, Error, number>({
    mutationFn: deleteMunicipality,
  });
};

// Hook for adding a municipality
export const useAddMunicipality = () => {
  return useMutation<void, Error, number>({
    mutationFn: addMunicipality,
  });
};

// Hook for adding a skill
export const useAddSkill = () => {
  return useMutation<void, Error, string>({
    mutationFn: addSkill,
  });
};

// Hook for adding a work image
export const useAddWorkImage = () => {
  return useMutation<void, Error, File>({
    mutationFn: addWorkImage,
  });
};