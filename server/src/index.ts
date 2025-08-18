import { WebSocketServer } from "ws";


const wss = new WebSocketServer({port : 8080});

interface User {
    socket : WebSocket,
    room : string
}

let allSockets : User[] = [];

wss.on("connection", (ws) => {
    console.log("Client connected");
})