import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { createRoomService, joinRoomService, ListJoinedRoomsService } from "../services/room.service";
import { userDetails } from "../utils/lib";
import { findOrCreateTagsService } from "../services/tag.service";
import { io } from "..";

export const createRoom = async (req: Request, res: Response) => {

    try {

        const { name, description, isPublic, tagIds, customTags } = req.body;

        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found." });
        }

        const creatorId: string = userId;

        let allTagIds = [...(tagIds || [])];

        if (customTags && Array.isArray(customTags) && customTags.length > 0) {
            const customTagIds = await findOrCreateTagsService(customTags);
            allTagIds = [...allTagIds, ...customTagIds];
        }

        const room = await createRoomService({ name, description, isPublic, tagIds: allTagIds, creatorId })

        const user = await userDetails(userId);

        io.to(room.id).emit("user-joined", {
            user
        })

        if (isPublic) {
            console.log('Emitting new-room event:', {
                id: room.id.toLocaleUpperCase(),
                name: room.name,
                isPublic: room.isPublic
            });
            
            io.emit("new-room", {
                id: room.id.toLocaleUpperCase(),
                name: room.name,
                isPublic: room.isPublic
            });
        }

        res.status(201).json({ 
            ...room, 
            id: room.id.toUpperCase(),
            members: room.members.map((m: { user: any }) => m.user)
        });
        return;
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Room creation failed" });

    }
}


export const joinRoom = async (req: Request, res: Response) => {

    try {

        const { roomCode } = req.body;

        if (!roomCode || typeof roomCode !== "string" || roomCode.trim().length !== 6) {

            return res.status(400).json({ message: "Invalid room code" });
        }

        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found." });
        }

        const room = await joinRoomService({ roomCode, userId });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const user = await userDetails(userId);

        io.to(roomCode).emit("user-joined", {
            user
        })

        res.status(200).json({
            ...room,
            id: room.id.toUpperCase(),
            members: room.members.map((m: { user: any }) => m.user),
        });
    } catch (err) {
        console.log(err)
        res.status(500).json("Failed to join room");

    }
}

export const ListJoinedRooms = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found." });
        }

        const roomMemberships = await ListJoinedRoomsService({ userId });

        if (!roomMemberships || roomMemberships.length === 0) {
            return res.status(200).json({ rooms: [] });
        }

        // Format the response with the required information
        const formattedRooms = roomMemberships.map(membership => {
            const isCreator = membership.room.creatorId === userId;
            
            return {
                id: membership.room.id,
                name: membership.room.name,
                description: membership.room.description,
                status: isCreator ? 'owner' : 'member', 
                isPrivate: !membership.room.isPublic,
                isCreator: isCreator,
                createdAt: membership.room.createdAt,
                updatedAt: membership.room.updatedAt,
                creator: {
                    id: membership.room.creator.id,
                    name: membership.room.creator.name,
                    profileUrl: membership.room.creator.profileUrl
                },

                memberCount: membership.room.members.length,
                lastActivity: membership.room.updatedAt
            };
        });

        return res.status(200).json({ rooms: formattedRooms });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to list joined rooms" });
    }
}