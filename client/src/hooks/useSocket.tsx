import { initSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        console.log('useSocket: Initializing socket');
        const s = initSocket();
        setSocket(s);

        // Track connection state
        const handleConnect = () => {
            console.log('useSocket: Connected');
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            console.log('useSocket: Disconnected');
            setIsConnected(false);
        };

        // Set up connection state tracking
        s.on('connect', handleConnect);
        s.on('disconnect', handleDisconnect);

        // Set initial connection state
        setIsConnected(s.connected);

        return () => {
            // Clean up event listeners but don't disconnect
            // This allows the socket to persist between component unmounts
            s.off('connect', handleConnect);
            s.off('disconnect', handleDisconnect);
            // Don't disconnect here to maintain connection across components
        };
    }, []);

    return { socket, isConnected };
}