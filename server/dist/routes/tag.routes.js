"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tag_controllers_1 = require("../controllers/tag.controllers");
const router = express_1.default.Router();
router.get("/", tag_controllers_1.getAllTags);
router.get("/:id", tag_controllers_1.getTagById);
router.post("/", tag_controllers_1.createTag);
exports.default = router;
