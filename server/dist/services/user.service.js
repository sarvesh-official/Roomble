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
exports.deleteUser = exports.createUser = void 0;
const client_1 = require("../prisma/client");
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.user.create({
        data: {
            id: userData.id,
            email: userData.email_addresses[0].email_address,
            name: `${userData.first_name} ${userData.last_name || ""}`.trim(),
            profileUrl: userData.image_url,
        },
    });
});
exports.createUser = createUser;
const deleteUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.user.delete({
        where: { id: userData.id },
    });
});
exports.deleteUser = deleteUser;
