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
exports.getMessagesByRoom = exports.addMessage = void 0;
const client_1 = require("../prisma/client");
const addMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.message.create({
        data: {
            roomId: data.roomId.toLowerCase(),
            senderId: data.senderId,
            senderName: data.senderName,
            senderProfileUrl: data.senderProfileUrl,
            content: data.content
        }
    });
});
exports.addMessage = addMessage;
const getMessagesByRoom = (roomCode) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all messages for the room
    const messages = yield client_1.prisma.message.findMany({
        where: { roomId: roomCode },
        orderBy: { createdAt: "asc" }
    });
    const participantIds = [...new Set(messages.map(msg => msg.senderId))];
    const participants = yield client_1.prisma.user.findMany({
        where: {
            id: { in: participantIds }
        },
        select: {
            id: true,
            name: true,
            profileUrl: true,
            updatedAt: true
        }
    });
    return {
        messages,
        participants: participants.map(p => ({
            id: p.id,
            name: p.name,
            isActive: Date.now() - new Date(p.updatedAt).getTime() < 5 * 60 * 1000,
            avatar: p.profileUrl || null
        }))
    };
});
exports.getMessagesByRoom = getMessagesByRoom;
