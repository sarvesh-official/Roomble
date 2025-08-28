import { Request, Response } from "express";
import { getAllTagsService, createTagService, getTagByIdService } from "../services/tag.service";

/**
 * Get all tags
 * Optional query param: categoryOnly=true to get only category tags
 */
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const categoryOnly = req.query.categoryOnly === 'true';
    const tags = await getAllTagsService(categoryOnly);
    res.status(200).json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tags" });
  }
};

/**
 * Get a tag by ID
 */
export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tag = await getTagByIdService(id);
    
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    
    res.status(200).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tag" });
  }
};

/**
 * Create a new tag
 */
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, isCategory } = req.body;
    
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Tag name is required" });
    }
    
    const tag = await createTagService({ name: name.trim(), isCategory });
    res.status(201).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create tag" });
  }
};
