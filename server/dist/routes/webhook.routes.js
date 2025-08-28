"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhook_controllers_1 = require("../controllers/webhook.controllers");
const express_2 = __importDefault(require("express"));
const router = (0, express_1.Router)();
router.post("/clerk", express_2.default.raw({ type: "application/json" }), webhook_controllers_1.handleClerkWebhook);
exports.default = router;
