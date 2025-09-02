import { CreateRoom, JoinRoom, Room } from "@/types/room";
import { createApiClient } from "./apiClient";
import { useAuth } from "@clerk/nextjs";

export const useRoomApi = () => {
  const { getToken } = useAuth();
  const { apiRequest } = createApiClient(() => getToken());

  const createRoom = async (data: CreateRoom) => {
    const response = await apiRequest("/api/rooms/create-room", {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  };

  const joinRoom = async (data: JoinRoom) => {
    const response = await apiRequest("/api/rooms/join-room", {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  };

  const getJoinedRooms = async (): Promise<{ rooms: Room[] }> => {
    const response = await apiRequest("/api/rooms/joined-rooms", {
      method: 'GET',
    });

    return response.json();
  };

  return { createRoom, joinRoom, getJoinedRooms };
};