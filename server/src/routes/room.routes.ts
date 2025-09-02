import {Router } from "express";
import { createRoom, joinRoom, ListJoinedRooms } from "../controllers/room.controllers";


const router = Router();

router.post("/create-room", createRoom);
router.post("/join-room", joinRoom);
router.get("/joined-rooms", ListJoinedRooms);

export default router;