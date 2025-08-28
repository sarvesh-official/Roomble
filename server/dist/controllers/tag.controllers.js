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
exports.createTag = exports.getTagById = exports.getAllTags = void 0;
const tag_service_1 = require("../services/tag.service");
const getAllTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryOnly = req.query.categoryOnly === 'true';
        const tags = yield (0, tag_service_1.getAllTagsService)(categoryOnly);
        res.status(200).json(tags);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch tags" });
    }
});
exports.getAllTags = getAllTags;
const getTagById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tag = yield (0, tag_service_1.getTagByIdService)(id);
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        res.status(200).json(tag);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch tag" });
    }
});
exports.getTagById = getTagById;
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, isCategory } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Tag name is required" });
        }
        const tag = yield (0, tag_service_1.createTagService)({ name: name.trim(), isCategory });
        res.status(201).json(tag);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create tag" });
    }
});
exports.createTag = createTag;
