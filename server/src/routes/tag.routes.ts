import express from "express";
import { getAllTags, getTagById, createTag } from "../controllers/tag.controllers";

const router = express.Router();

router.get("/", getAllTags);
router.get("/:id", getTagById);
router.post("/", createTag);

export default router;
