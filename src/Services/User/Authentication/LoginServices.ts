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
  return response.data;
};


export const authService = {
  logout: async (): Promise<void> => {
    await axios.post("https://localhost:7115/api/Auth/labourlink/logout", {}, { withCredentials: true });
  },
};