import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import webHooksRoutes from "./routes/webhook.routes";

configDotenv();

const port = process.env.PORT || 5000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
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
app.use(clerkMiddleware());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up!");
});

app.use("/api/webhooks", webHooksRoutes);

io.on("connection", (socket) => {
  console.log("connected ", socket.id);
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
