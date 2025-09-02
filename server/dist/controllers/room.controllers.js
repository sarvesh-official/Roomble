"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListJoinedRooms = exports.joinRoom = exports.createRoom = void 0;
const express_1 = require("@clerk/express");
const room_service_1 = require("../services/room.service");
const lib_1 = require("../utils/lib");
const tag_service_1 = require("../services/tag.service");
const __1 = require("..");
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, isPublic, tagIds, customTags } = req.body;
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found." });
        }
        const creatorId = userId;
        let allTagIds = [...(tagIds || [])];
        if (customTags && Array.isArray(customTags) && customTags.length > 0) {
            const customTagIds = yield (0, tag_service_1.findOrCreateTagsService)(customTags);
            allTagIds = [...allTagIds, ...customTagIds];
        }
        const room = yield (0, room_service_1.createRoomService)({ name, description, isPublic, tagIds: allTagIds, creatorId });
        const user = yield (0, lib_1.userDetails)(userId);
        __1.io.to(room.id).emit("user-joined", {
            user
        });
        if (isPublic) {
            __1.io.emit("new-room", {
                id: room.id.toLocaleUpperCase(),
                name: room.name,
                isPublic: room.isPublic
            });
        }
        res.status(201).json(Object.assign(Object.assign({}, room), { id: room.id.toUpperCase(), members: room.members.map((m) => m.user) }));
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Room creation failed" });
    }
});
exports.createRoom = createRoom;
const joinRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomCode } = req.body;
        if (!roomCode || typeof roomCode !== "string" || roomCode.trim().length !== 6) {
            return res.status(400).json({ message: "Invalid room code" });
        }
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found." });
        }
        const room = yield (0, room_service_1.joinRoomService)({ roomCode, userId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const user = yield (0, lib_1.userDetails)(userId);
        __1.io.to(roomCode).emit("user-joined", {
            user
        });
        res.status(200).json(Object.assign(Object.assign({}, room), { id: room.id.toUpperCase(), members: room.members.map((m) => m.user) }));
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Failed to join room");
    }
});
exports.joinRoom = joinRoom;
const ListJoinedRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found." });
        }
        const roomMemberships = yield (0, room_service_1.ListJoinedRoomsService)({ userId });
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to list joined rooms" });
    }
});
exports.ListJoinedRooms = ListJoinedRooms;
