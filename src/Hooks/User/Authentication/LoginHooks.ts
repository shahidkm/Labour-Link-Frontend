import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { loginUser } from "../../../Services/User/Authentication/LoginServices";
import { useDispatch } from "react-redux";
import { setUser } from "../../../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../Services/User/Authentication/LoginServices";
export const useAccountLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (!data || !data.userType) {
        toast.error("Invalid response from server.");
        return;
      }
      toast.success(`Logged in as: ${data.userType}`);

      dispatch(setUser({ 
        userType: data.userType, 
        isProfileCompleted: data.profileCompletion 
      }));

      navigate(
        data.userType === "Labour"
          ? "/labour-home-page"
          : data.userType === "Employer"
          ? "/client-home-page"
          : "/"
      );
    },
    onError: () => {
      toast.error("Login failed. Please try again.");
    },
  });
};



export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
  });
};