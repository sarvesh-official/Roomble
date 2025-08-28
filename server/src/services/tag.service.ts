import { prisma } from "../prisma/client";
import { CreateTag } from "../types/tag.types";

/**
 * Get all tags, optionally filtered by category status
 */
export const getAllTagsService = async (categoryOnly?: boolean) => {
  const where = categoryOnly ? { isCategory: true } : {};
  
  return prisma.tag.findMany({
    where,
    orderBy: [
      { isCategory: 'desc' }, // Categories first
      { name: 'asc' }         // Then alphabetically
    ]
  });
};

/**
 * Get a tag by ID
 */
export const getTagByIdService = async (id: string) => {
  return prisma.tag.findUnique({
    where: { id }
  });
};

/**
 * Create a new tag
 */
export const createTagService = async (data: CreateTag) => {
  // Check if tag with same name already exists (case insensitive)
  const existingTag = await prisma.tag.findFirst({
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

  return prisma.tag.create({
    data: {
      name: data.name,
      isCategory: data.isCategory || false
    }
  });
};

/**
 * Find or create tags from an array of names
 * Returns array of tag IDs
 */
export const findOrCreateTagsService = async (tagNames: string[]): Promise<string[]> => {
  if (!tagNames || tagNames.length === 0) {
    return [];
  }

  const tagIds: string[] = [];

  for (const name of tagNames) {
    if (!name.trim()) continue;
    
    // Try to find existing tag (case insensitive)
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (existingTag) {
      tagIds.push(existingTag.id);
    } else {
      // Create new tag if it doesn't exist
      const newTag = await prisma.tag.create({
        data: {
          name: name.trim(),
          isCategory: false // User-created tags are not categories
        }
      });
      tagIds.push(newTag.id);
    }
  }

  return tagIds;
};
