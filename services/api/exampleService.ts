import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './axios';

// Example Interface for data
export interface UserData {
  id: number;
  name: string;
  email: string;
}

// ---------------------------------------------------------
// API Calls (using Axios)
// ---------------------------------------------------------

export const fetchUsers = async (): Promise<UserData[]> => {
  // Uses the base URL and adds /users
  const response = await apiClient.get('/users');
  return response.data;
};

export const fetchUserById = async (id: number): Promise<UserData> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (newUserData: Omit<UserData, 'id'>): Promise<UserData> => {
  const response = await apiClient.post('/users', newUserData);
  return response.data;
};

// ---------------------------------------------------------
// React Query Hooks
// ---------------------------------------------------------

// Query Hook for fetching multiple items
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

// Query Hook for fetching a single item
export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
};

// Mutation Hook for creating an item
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch the 'users' query when a new user is created
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
