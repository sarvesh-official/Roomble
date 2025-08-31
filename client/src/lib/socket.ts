import {io, Socket} from 'socket.io-client';

let socket: Socket | null = null;

export function initSocket(){

    if(!socket){
        socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000");
    }

    socket.on("connect", () => {
        console.log("Socket connected", socket?.id);
    })

    socket.on("disconnect", () => {
        console.log("Socket disconnected", socket?.id);
    })

    return socket;
}

export function getSocket(): Socket {
    if (!socket) {
      throw new Error("Socket not initialized. Call initSocket() first.");
    }
    return socket;
  }