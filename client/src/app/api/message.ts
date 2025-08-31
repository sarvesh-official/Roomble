import { createApiClient } from "./apiClient";
import { useAuth } from "@clerk/nextjs";
import { CreateMessageInput } from "@/types/message";

export const useMessageApi = () => {
  const { getToken } = useAuth();
  const { apiRequest } = createApiClient(() => getToken());

  const sendMessage = async (data: CreateMessageInput) => {
    const response = await apiRequest("/api/messages/send-message", {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  };

  const getMessages = async (roomId: string) => {
    const response = await apiRequest(`/api/messages/get-messages/${roomId}`, {
      method: 'GET',
    });

    return response.json();
  };

  return { sendMessage, getMessages };
};