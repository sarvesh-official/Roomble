import { prisma } from "../prisma/client";
import { CreateMessageInput } from "../types/message.types";

export const addMessage = async (data: CreateMessageInput) => {
    return prisma.message.create({
        data: {
            roomId: data.roomId,
            senderId: data.senderId,
            senderName: data.senderName,
            senderProfileUrl: data.senderProfileUrl,
            content: data.content
        }
    })
}

export const getMessagesByRoom = async (roomCode: string) => {
    return prisma.message.findMany({
        where: { roomId: roomCode }, orderBy: { createdAt: "asc" }
    })
}