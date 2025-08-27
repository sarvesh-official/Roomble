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
            roomId: data.roomId,
            senderId: data.senderId,
            senderName: data.senderName,
            senderProfileUrl: data.senderProfileUrl,
            content: data.content
        }
    });
});
exports.addMessage = addMessage;
const getMessagesByRoom = (roomCode) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.message.findMany({
        where: { roomId: roomCode }, orderBy: { createdAt: "asc" }
    });
});
exports.getMessagesByRoom = getMessagesByRoom;
