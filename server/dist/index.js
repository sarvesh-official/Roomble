"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("message", (message) => {
        var _a;
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type == "chat") {
            const currentUserRoom = (_a = allSockets.find(user => user.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            allSockets.forEach(user => {
                if (user.room == currentUserRoom) {
                    user.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        allSockets = allSockets.filter(user => user.socket !== socket);
    });
});
