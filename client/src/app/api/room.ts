import { CreateRoom, JoinRoom } from "@/types/room"


export const BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || ""


export async function createRoom(data: CreateRoom) {

    const response = await fetch(`${BACKEND_URL}/api/rooms/create-room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(`Failed to create room: ${response.statusText}`);
    }

    return response.json();
}

export async function joinRoom(data: JoinRoom) {

    const response = await fetch(`${BACKEND_URL}/api/rooms/join-room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(`Failed to join room: ${response.statusText}`);
    }

    return response.json();

}