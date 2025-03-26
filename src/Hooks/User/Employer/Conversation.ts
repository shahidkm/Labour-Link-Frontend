import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface CreateConversationRequest {
  user2Id: string;  // This is the userId, not labourId
  message: string;
}

interface CreateConversationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateConversationResponse, Error, CreateConversationRequest>({
    mutationFn: async (data: CreateConversationRequest) => {
      // Use the correct URL format as shown in your example
      // The URL appears to use query parameters instead of a request body
      const response = await axios.post<CreateConversationResponse>(
        `https://localhost:7202/api/Conversation/create/converasation?user2Id=${data.user2Id}&message=${encodeURIComponent(data.message)}`,
        {}, // Empty body since we're using query params
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch conversations after successfully creating a new one
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
};