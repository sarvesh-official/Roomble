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
exports.findOrCreateTagsService = exports.createTagService = exports.getTagByIdService = exports.getAllTagsService = void 0;
const client_1 = require("../prisma/client");
/**
 * Get all tags, optionally filtered by category status
 */
const getAllTagsService = (categoryOnly) => __awaiter(void 0, void 0, void 0, function* () {
    const where = categoryOnly ? { isCategory: true } : {};
    return client_1.prisma.tag.findMany({
        where,
        orderBy: [
            { isCategory: 'desc' }, // Categories first
            { name: 'asc' } // Then alphabetically
        ]
    });
});
exports.getAllTagsService = getAllTagsService;
/**
 * Get a tag by ID
 */
const getTagByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.tag.findUnique({
        where: { id }
    });
});
exports.getTagByIdService = getTagByIdService;
/**
 * Create a new tag
 */
const createTagService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if tag with same name already exists (case insensitive)
    const existingTag = yield client_1.prisma.tag.findFirst({
        where: {
            name: {
                equals: data.name,
                mode: 'insensitive'
            }
        }
    });
    if (existingTag) {
        return existingTag;
    }
    return client_1.prisma.tag.create({
        data: {
            name: data.name,
            isCategory: data.isCategory || false
        }
    });
});
exports.createTagService = createTagService;
/**
 * Find or create tags from an array of names
 * Returns array of tag IDs
 */
const findOrCreateTagsService = (tagNames) => __awaiter(void 0, void 0, void 0, function* () {
    if (!tagNames || tagNames.length === 0) {
        return [];
    }
    const tagIds = [];
    for (const name of tagNames) {
        if (!name.trim())
            continue;
        // Try to find existing tag (case insensitive)
        const existingTag = yield client_1.prisma.tag.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive'
                }
            }
        });
        if (existingTag) {
            tagIds.push(existingTag.id);
        }
        else {
            // Create new tag if it doesn't exist
            const newTag = yield client_1.prisma.tag.create({
                data: {
                    name: name.trim(),
                    isCategory: false // User-created tags are not categories
                }
            });
            tagIds.push(newTag.id);
        }
    }
    return tagIds;
});
exports.findOrCreateTagsService = findOrCreateTagsService;
