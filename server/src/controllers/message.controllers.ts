import { Request, Response } from "express";
import { addMessage, getMessagesByRoom } from "../services/message.service";
import { socketModule } from "../index";

export const sendMessage = async (req: Request, res: Response) => {

    try {

        const { roomId, content, senderId, senderName, senderProfileUrl } = req.body;

        if (!roomId || !content || !senderId || !senderName) {
            return res.status(400).json({ message: "Missing required fields" });
        }

            socketModule.getIO().to(roomId).emit("new-message", { content, senderName, senderProfileUrl });

        const message = await addMessage({
            roomId,
            senderId,
            senderName,
            senderProfileUrl,
            content,
        });

        res.status(201).json(message);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send message" });
    }
}

export const fetchMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "Missing roomId" });
    }

    const messages = await getMessagesByRoom(roomId);

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};