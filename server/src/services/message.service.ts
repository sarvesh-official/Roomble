import { prisma } from "../prisma/client";
import { CreateMessageInput } from "../types/message.types";

export const addMessage = async (data: CreateMessageInput) => {
    return prisma.message.create({
        data
    })
}

export const getMessagesByRoom = async (roomCode: string) => {
    return prisma.message.findMany({
        where: { id: roomCode }, orderBy: { createdAt: "asc" }
    })
}