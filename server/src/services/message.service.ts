import { prisma } from "../prisma/client";
import { CreateMessageInput } from "../types/message.types";

export const addMessage = async (data: CreateMessageInput) => {
    return prisma.message.create({
        data: {
            roomId: data.roomId.toLowerCase(),
            senderId: data.senderId,
            senderName: data.senderName,
            senderProfileUrl: data.senderProfileUrl,
            content: data.content
        }
    })
}

export const getMessagesByRoom = async (roomCode: string) => {
    // Get all messages for the room
    const messages = await prisma.message.findMany({
        where: { roomId: roomCode }, 
        orderBy: { createdAt: "asc" }
    });
    
    const participantIds = [...new Set(messages.map(msg => msg.senderId))];
    
    const participants = await prisma.user.findMany({
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
}