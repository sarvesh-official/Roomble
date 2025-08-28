import { Tag } from "@/types/tag";
import { createApiClient } from "./apiClient";
import { useAuth } from "@clerk/nextjs";

export const useTagApi = () => {
  const { getToken } = useAuth();
  const { apiRequest } = createApiClient(() => getToken());

  const getTags = async (categoryOnly?: boolean): Promise<Tag[]> => {
    let endpoint = "/api/tags";
    
    if (categoryOnly) {
      endpoint += `?categoryOnly=true`;
    }

    const response = await apiRequest(endpoint, {
      method: 'GET',
    });

    return response.json();
  };


  const createTag = async (name: string, isCategory: boolean = false): Promise<Tag> => {
    const response = await apiRequest("/api/tags", {
      method: 'POST',
      body: JSON.stringify({ name, isCategory }),
    });

    return response.json();
  };

  return { getTags, createTag };
};
