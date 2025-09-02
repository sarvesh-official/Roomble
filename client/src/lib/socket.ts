import {io, Socket} from 'socket.io-client';

let socket: Socket | null = null;

export function initSocket(){

    if (socket && !socket.connected) {
        console.log("Socket exists but disconnected. Reconnecting...");
        socket.connect();
    }

    if (!socket) {
        console.log("Creating new socket connection");
        socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", {
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
            forceNew: false,
            transports: ['websocket', 'polling']
        });

        socket.on("connect", () => {
            console.log("Socket connected", socket?.id);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected", socket?.id, "Reason:", reason);
            
            if (reason === 'io server disconnect') {
                socket?.connect();
            }
        });
    }

    return socket;
}

export function getSocket(): Socket {
    if (!socket) {
      throw new Error("Socket not initialized. Call initSocket() first.");
    }
    return socket;
  }