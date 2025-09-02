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
exports.ListJoinedRoomsService = exports.joinRoomService = exports.createRoomService = void 0;
const client_1 = require("../prisma/client");
const lib_1 = require("../utils/lib");
const createRoomService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let roomCode = "";
    let exists = true;
    while (exists) {
        roomCode = yield (0, lib_1.generateRoomId)();
        roomCode = roomCode.toLowerCase();
        exists = (yield client_1.prisma.room.findUnique({ where: { id: roomCode } })) !== null;
    }
    return client_1.prisma.room.create({
        data: {
            id: roomCode,
            name: data.name,
            description: data.description,
            isPublic: data.isPublic,
            creatorId: data.creatorId,
            tags: {
                connect: (_a = data.tagIds) === null || _a === void 0 ? void 0 : _a.map(tagId => ({ id: tagId }))
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
    });
});
exports.createRoomService = createRoomService;
const joinRoomService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomCode, userId }) {
    const room = yield client_1.prisma.room.findUnique({
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
    });
    if (!room) {
        throw new Error("Room not found");
    }
    const isMember = room.members.some((m) => m.userId === userId);
    if (!isMember) {
        yield client_1.prisma.roomMembers.create({
            data: {
                roomId: room.id,
                userId,
            },
        });
    }
    return yield client_1.prisma.room.findUnique({
        where: { id: room.id },
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    });
});
exports.joinRoomService = joinRoomService;
const ListJoinedRoomsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
    return yield client_1.prisma.roomMembers.findMany({
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
    });
});
exports.ListJoinedRoomsService = ListJoinedRoomsService;
