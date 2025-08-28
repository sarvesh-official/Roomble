import { WebSocket, WebSocketServer } from "ws";


const wss = new WebSocketServer({port : 8080});

interface User {
    socket : WebSocket,
    room : string
}

let allSockets : User[] = [];

wss.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", (message ) =>{
        // @ts-ignore
        const parsedMessage = JSON.parse(message);

        if(parsedMessage.type == "join"){
            allSockets.push({
                socket,
                room : parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type == "chat"){

            const currentUserRoom = allSockets.find(user => user.socket == socket)?.room ;

            allSockets.forEach(user => {
                if (user.room == currentUserRoom){
                    user.socket.send(parsedMessage.payload.message)
                }
            })

        }

    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        allSockets = allSockets.filter(user => user.socket !== socket )
    })
    
})