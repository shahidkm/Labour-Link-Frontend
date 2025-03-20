import axios, { AxiosResponse } from "axios";

export interface RegisterData {
  email: string;
  password: string;
  userType: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const registerUser = async (data: RegisterData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(
      "https://localhost:7115/api/Auth/labourlink/register",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};
