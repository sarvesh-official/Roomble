import { initSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";


export function useSocket() {

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {

        const s = initSocket();
        setSocket(s);

        return () =>{
            s.disconnect();
        }
    }, [])

    return socket;
}