import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../../Services/User/Authentication/LoginServices";
import { authService } from "../../../Services/User/Authentication/LoginServices";
import { setUser } from "../../../Redux/userSlice";

export const useAccountLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Full login response data:", data);
      
      // Ensure data and userType exist
      if (!data || !data.userType) {
        return;
      }
console.log(data);

      // Dispatch user information to Redux
      dispatch(setUser({ 
        userType: data.userType, 
        isProfileCompleted: data.isProfileCompleted
      }));

      // Navigation logic based on userType and isProfileCompleted
      if (data.userType === "Labour") {
        // If profile is not completed, go to profile settings
        if (!data.isProfileCompleted) {
          navigate("/profile-settings");
          return;
        }
        // If profile is completed, go to labour home page
        // navigate("/labour-home-page");
        // return;
      }

      if (data.userType === "Employer") {
        navigate("/client-home-page");
        return;
      }

      // Fallback navigation
      navigate("/");
    },
    onError: (error) => {
      console.error("Login error details:", error);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
  });
};