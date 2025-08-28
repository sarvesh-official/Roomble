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
exports.handleClerkWebhook = void 0;
const clerk_1 = require("../utils/clerk");
const user_service_1 = require("../services/user.service");
const handleClerkWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield (0, clerk_1.verifyClerkWebhook)(req);
        if (event.type === "user.created") {
            yield (0, user_service_1.createuser)(event.data);
        }
        if (event.type === "user.deleted") {
            yield (0, user_service_1.deleteuser)(event.data);
        }
        return res.status(200).send("Webhook received");
    }
    catch (err) {
        console.error("Webhook verification failed: ", err);
        return res.status(400).send("Invalid webhook");
    }
});
exports.handleClerkWebhook = handleClerkWebhook;
