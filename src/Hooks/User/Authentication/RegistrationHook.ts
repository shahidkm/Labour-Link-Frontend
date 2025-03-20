import { useMutation } from "@tanstack/react-query";
import { registerUser, ApiResponse, RegisterData } from "../../../Services/User/Authentication/RegisterService";
import toast from "react-hot-toast";

export const useRegisterUser = () => {
  return useMutation<ApiResponse, Error, RegisterData>({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};
