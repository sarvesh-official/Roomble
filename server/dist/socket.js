"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIO = exports.io = exports.createSocketServer = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
// Create a function to initialize socket.io
const createSocketServer = (app) => {
    const server = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
    });
    io.on("connection", (socket) => {
        console.log("connected ", socket.id);
        socket.on("disconnect", () => {
            console.log("disconnected", socket.id);
        });
    });
    return { server, io };
};
exports.createSocketServer = createSocketServer;
const setIO = (socketIO) => {
    exports.io = socketIO;
};
exports.setIO = setIO;
