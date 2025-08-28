import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { createRoomService, joinRoomService } from "../services/room.service";
import { socketModule } from "../index";
import { userDetails } from "../utils/lib";

export const createRoom = async (req: Request, res: Response) => {

    try {

        const { name, description, isPublic, tagIds } = req.body;

        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found." });
        }

        const creatorId: string = userId;

        const room = await createRoomService({ name, description, isPublic, tagIds, creatorId })

        if (isPublic) {
            socketModule.getIO().emit("new room", {
                id: room.id.toLocaleUpperCase(),
                name: room.name,
                isPublic: room.isPublic
            })
        }

        res.status(201).json({ ...room, id: room.id.toUpperCase() });
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

        socketModule.getIO().to(roomCode).emit("user-joined", {
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