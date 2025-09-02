import { prisma } from "../prisma/client";
import { CreateRoom, JoinRoom } from "../types/room.types";
import { generateRoomId } from "../utils/lib";


export const createRoomService = async (data: CreateRoom) => {

    let roomCode: string = "";
    let exists = true;

    while (exists) {
        roomCode = await generateRoomId()
        roomCode = roomCode.toLowerCase();
        exists = await prisma.room.findUnique({ where: { id: roomCode } }) !== null
    }

    return prisma.room.create({
        data: {
            id: roomCode,
            name: data.name,
            description: data.description,
            isPublic: data.isPublic,
            creatorId: data.creatorId,
            tags: {
                connect: data.tagIds?.map(tagId => ({ id: tagId }))
            },
            members: {
                create: {
                    userId: data.creatorId,
                }
            }
        },
        include: {
            tags: true,
            creator: true,
            members: {
                include: {
                    user: true,
                }
            }
        }
    })
}


export const joinRoomService = async ({ roomCode, userId }: JoinRoom) => {

    const room = await prisma.room.findUnique({
        where: {
            id: roomCode.toLowerCase()
        },
        include: {
            members: {
                include: {
                    user: true,
                }
            }
        }
    })

    if (!room) {
        throw new Error("Room not found");
    }

    const isMember = room.members.some((m: any) => m.userId === userId);

    if (!isMember) {
        await prisma.roomMembers.create({
            data: {
                roomId: room.id,
                userId,
            },
        })
    }

    return await prisma.room.findUnique({
        where: { id: room.id },
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    });
}

export const ListJoinedRoomsService = async ({ userId }: { userId: string }) => {
    return await prisma.roomMembers.findMany({
        where: {
            userId,
        },
        include: {
            room: {
                include: {
                    creator: true,
                    members: true
                }
            }
        }
    })
}