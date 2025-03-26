import axios from "axios";

export interface LoginFormInputs {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginFormInputs) => {
  const response = await axios.post(
    "https://localhost:7115/api/Auth/labourlink/login",
    credentials,
    { withCredentials: true }
  );

  if (!response.data || !response.data.userType) {
    throw new Error("Invalid response from server.");
  }

  localStorage.setItem("UserType", response.data.userType);
  
  localStorage.setItem("isProfileCompleted", response.data.isProfileCompleted);
  return response.data;
};


export const authService = {
  logout: async (): Promise<void> => {
    await axios.post("https://localhost:7115/api/Auth/labourlink/logout", {}, { withCredentials: true });
  },
};








export const authServiceCheck = {
  isProfileCompleted: async () => {
    try {
      const response = await axios.get<boolean>("https://localhost:7115/api/Auth/isProfileCompleted", {
        withCredentials: true // Include credentials if using cookies for authentication
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle specific axios error
        throw new Error(error.response?.data || 'Failed to check profile completion');
      }
      // Handle generic error
      throw new Error('An unexpected error occurred');
    }
  }
};