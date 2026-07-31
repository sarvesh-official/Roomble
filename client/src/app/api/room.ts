import { CreateRoom, JoinRoom, Room } from "@/types/room";
import { createApiClient } from "./apiClient";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";

export const useRoomApi = () => {
  const { getToken } = useAuth();
  const { apiRequest } = useMemo(() => createApiClient(() => getToken()), [getToken]);

  const createRoom = useCallback(async (data: CreateRoom) => {
    const response = await apiRequest("/api/rooms/create-room", {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  }, [apiRequest]);

  const joinRoom = useCallback(async (data: JoinRoom) => {
    const response = await apiRequest("/api/rooms/join-room", {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  }, [apiRequest]);

  const getJoinedRooms = useCallback(async (): Promise<{ rooms: Room[] }> => {
    const response = await apiRequest("/api/rooms/joined-rooms", {
      method: 'GET',
    });

    return response.json();
  }, [apiRequest]);

  return { createRoom, joinRoom, getJoinedRooms };
};
