"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controllers_1 = require("../controllers/room.controllers");
const router = (0, express_1.Router)();
router.post("/create-room", room_controllers_1.createRoom);
router.post("/join-room", room_controllers_1.joinRoom);
router.get("/joined-rooms", room_controllers_1.ListJoinedRooms);
exports.default = router;
