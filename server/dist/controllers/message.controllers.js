"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessages = exports.sendMessage = void 0;
const message_service_1 = require("../services/message.service");
const index_1 = require("../index");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, content, senderId, senderName, senderProfileUrl } = req.body;
        if (!roomId || !content || !senderId || !senderName) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        index_1.socketModule.getIO().to(roomId).emit("new-message", { content, senderName, senderProfileUrl });
        const message = yield (0, message_service_1.addMessage)({
            roomId,
            senderId,
            senderName,
            senderProfileUrl,
            content,
        });
        res.status(201).json(message);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send message" });
    }
});
exports.sendMessage = sendMessage;
const fetchMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            return res.status(400).json({ message: "Missing roomId" });
        }
        const messages = yield (0, message_service_1.getMessagesByRoom)(roomId);
        res.status(200).json(messages);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});
exports.fetchMessages = fetchMessages;
