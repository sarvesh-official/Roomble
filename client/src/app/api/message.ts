import { createApiClient } from "./apiClient";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { CreateMessageInput } from "@/types/message";

export const useMessageApi = () => {
  const { getToken } = useAuth();
  const { apiRequest } = useMemo(() => createApiClient(() => getToken()), [getToken]);

  const sendMessage = useCallback(async (data: CreateMessageInput) => {
    const response = await apiRequest("/api/messages/send-message", {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  }, [apiRequest]);

  const getMessages = useCallback(async (roomId: string) => {
    const response = await apiRequest(`/api/messages/get-messages/${roomId}`, {
      method: 'GET',
    });

    return response.json();
  }, [apiRequest]);

  return { sendMessage, getMessages };
};
