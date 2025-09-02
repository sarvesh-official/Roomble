import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import webHooksRoutes from "./routes/webhook.routes";
import roomRoutes from "./routes/room.routes";
import messageRoutes from "./routes/message.routes";
import tagRoutes from "./routes/tag.routes";
import { requireAuth } from "./middleware/authMiddleware";

configDotenv();

const port = process.env.PORT || 5000;
const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});


app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up!");
});

app.use("/api/webhooks", webHooksRoutes);

app.use(clerkMiddleware({publishableKey : process.env.CLERK_PUBLIC_KEY as string, secretKey : process.env.CLERK_SECRET_KEY as string}));

app.use("/api/tags", requireAuth, tagRoutes);

app.use("/api/rooms", requireAuth, roomRoutes)
app.use("/api/messages", requireAuth, messageRoutes)

// Track room participants
const roomParticipants: Record<string, Array<{
  id: string;
  name: string;
  isActive: boolean;
  avatar: string | null;
  socketId: string;
}>> = {};

io.on("connection", (socket) => {
  console.log("connected ", socket.id);

  socket.on("join-room", (roomId, userData) => {
    // Join the socket to the room
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
    
    // Initialize room participants array if it doesn't exist
    if (!roomParticipants[roomId]) {
      roomParticipants[roomId] = [];
    }
    
    // Add participant to the room
    const participant = {
      id: userData?.userId || socket.id,
      name: userData?.name || 'Anonymous',
      isActive: true,
      avatar: userData?.avatar || null,
      socketId: socket.id
    };
    
    // Check if participant already exists
    const existingParticipantIndex = roomParticipants[roomId].findIndex(p => p.id === participant.id);
    if (existingParticipantIndex >= 0) {
      // Update existing participant
      roomParticipants[roomId][existingParticipantIndex] = participant;
    } else {
      // Add new participant
      roomParticipants[roomId].push(participant);
    }
    
    // Notify all clients in the room about the new participant
    io.to(roomId).emit('participant-joined', participant);
    
    // Send updated participants list to the room
    io.to(roomId).emit('room-participants', roomParticipants[roomId]);
  });
  
  socket.on("get-participants", (roomId) => {
    // Send current participants list to the requesting client
    if (roomParticipants[roomId]) {
      socket.emit('room-participants', roomParticipants[roomId]);
    } else {
      socket.emit('room-participants', []);
    }
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
    
    // Find and mark participant as inactive
    if (roomParticipants[roomId]) {
      const participantIndex = roomParticipants[roomId].findIndex(p => p.socketId === socket.id);
      if (participantIndex >= 0) {
        const participantId = roomParticipants[roomId][participantIndex].id;
        roomParticipants[roomId][participantIndex].isActive = false;
        
        // Notify all clients in the room about the participant leaving
        io.to(roomId).emit('participant-left', participantId);
        
        // Send updated participants list to the room
        io.to(roomId).emit('room-participants', roomParticipants[roomId]);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    
    // Find all rooms this socket was in and mark participant as inactive
    Object.keys(roomParticipants).forEach(roomId => {
      const participantIndex = roomParticipants[roomId].findIndex(p => p.socketId === socket.id);
      if (participantIndex >= 0) {
        const participantId = roomParticipants[roomId][participantIndex].id;
        roomParticipants[roomId][participantIndex].isActive = false;
        
        // Notify all clients in the room about the participant leaving
        io.to(roomId).emit('participant-left', participantId);
        
        // Send updated participants list to the room
        io.to(roomId).emit('room-participants', roomParticipants[roomId]);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
