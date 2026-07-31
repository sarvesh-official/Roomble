import { Tag } from "@/types/tag";
import { createApiClient } from "./apiClient";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";

export const useTagApi = () => {
  const { getToken } = useAuth();
  const { apiRequest } = useMemo(() => createApiClient(() => getToken()), [getToken]);

  const getTags = useCallback(async (categoryOnly?: boolean): Promise<Tag[]> => {
    let endpoint = "/api/tags";

    if (categoryOnly) {
      endpoint += `?categoryOnly=true`;
    }

    const response = await apiRequest(endpoint, {
      method: 'GET',
    });

    return response.json();
  }, [apiRequest]);

  const createTag = useCallback(async (name: string, isCategory: boolean = false): Promise<Tag> => {
    const response = await apiRequest("/api/tags", {
      method: 'POST',
      body: JSON.stringify({ name, isCategory }),
    });

    return response.json();
  }, [apiRequest]);

  return { getTags, createTag };
};
