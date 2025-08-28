import { Tag } from "@/types/tag";
import { BACKEND_URL } from "./room";

/**
 * Fetch all tags from the server
 * @param categoryOnly Optional parameter to fetch only category tags
 */
export async function getTags(categoryOnly?: boolean): Promise<Tag[]> {
  const url = new URL(`${BACKEND_URL}/api/tags`);
  
  if (categoryOnly) {
    url.searchParams.append('categoryOnly', 'true');
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new tag
 * @param name Tag name
 * @param isCategory Whether the tag is a category
 */
export async function createTag(name: string, isCategory: boolean = false): Promise<Tag> {
  const response = await fetch(`${BACKEND_URL}/api/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, isCategory }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create tag: ${response.statusText}`);
  }

  return response.json();
}
