"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controllers_1 = require("../controllers/message.controllers");
const router = (0, express_1.Router)();
router.post("/send-message", message_controllers_1.sendMessage);
router.get("/get-messages/:roomId", message_controllers_1.fetchMessages);
exports.default = router;
