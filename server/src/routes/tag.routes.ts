import express from "express";
import { getAllTags, getTagById, createTag } from "../controllers/tag.controllers";

const router = express.Router();

// GET all tags (with optional categoryOnly query param)
router.get("/", getAllTags);

// GET tag by ID
router.get("/:id", getTagById);

// POST create new tag
router.post("/", createTag);

export default router;
