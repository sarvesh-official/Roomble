import {Router } from "express";
import { createRoom, joinRoom } from "../controllers/room.controllers";


const router = Router();

router.post("/create-room", createRoom);
router.post("/join-room", joinRoom);

export default router;