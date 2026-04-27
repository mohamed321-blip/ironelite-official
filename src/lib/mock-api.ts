import { useState } from 'react';

export const apiClient = {
  get: () => Promise.resolve({ data: [] }),
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} }),
};

// This fixes the "useGetMe is not defined" error
export const useGetMe = () => {
  return { data: null, isLoading: false, error: null };
};

export const useAuthStore = () => ({ user: null });
export const useCartStore = () => ({ items: [] });

export default apiClient;
