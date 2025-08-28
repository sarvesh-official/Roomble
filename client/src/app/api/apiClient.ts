export const BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


export const createApiClient = (getToken: () => Promise<string | null>) => {
 
  const apiRequest = async (
    endpoint: string, 
    options: RequestInit = {}
  ) => {
    try {
      const token = await getToken();
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  return { apiRequest };
};

/**
 * Hook to use in components for making authenticated API requests
 * Usage example:
 * 
 * import { useAuth } from "@clerk/nextjs";
 * import { createApiClient } from "./apiClient";
 * 
 * const MyComponent = () => {
 *   const { getToken } = useAuth();
 *   const { apiRequest } = createApiClient(() => getToken());
 *   
 *   const fetchData = async () => {
 *     const response = await apiRequest("/api/endpoint");
 *     const data = await response.json();
 *   };
 * };
 */
