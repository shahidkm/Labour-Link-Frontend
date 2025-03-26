import axios from 'axios';

export interface ConversationRequestData {
  user2Id: string;
  message: string;
}

export interface ConversationResponse {
  data: {
    conversationId: string;
    status: string;
  };
  isSuccess: boolean;
  message: string;
}

// Create a properly configured axios instance for conversations
const conversationApi = axios.create({
  baseURL: 'https://localhost:7202/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const createConversation = async (data: ConversationRequestData): Promise<ConversationResponse> => {
  // Fixed the endpoint URL
  const response = await conversationApi.post('/Conversation/create/conversation', data);
  return response.data;
};