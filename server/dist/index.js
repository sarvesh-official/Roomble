"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
const room_routes_1 = __importDefault(require("./routes/room.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const tag_routes_1 = __importDefault(require("./routes/tag.routes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
(0, dotenv_1.configDotenv)();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
app.use(express_1.default.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },
}));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Server is up!");
});
app.use("/api/webhooks", webhook_routes_1.default);
app.use((0, express_2.clerkMiddleware)({ publishableKey: process.env.CLERK_PUBLIC_KEY, secretKey: process.env.CLERK_SECRET_KEY }));
app.use("/api/tags", authMiddleware_1.requireAuth, tag_routes_1.default);
app.use("/api/rooms", authMiddleware_1.requireAuth, room_routes_1.default);
app.use("/api/messages", authMiddleware_1.requireAuth, message_routes_1.default);
exports.io.on("connection", (socket) => {
    console.log("connected ", socket.id);
    socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
    });
});
server.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
