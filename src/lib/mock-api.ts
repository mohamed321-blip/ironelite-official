export const apiClient = {
  get: () => Promise.resolve({ data: [] }),
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} }),
};

export const useGetMe = () => ({ data: null, isLoading: false, error: null });
export const getMeQueryKey = 'getMe';
export const useAuthStore = () => ({ user: null });
export const useCartStore = () => ({ items: [] });

export default apiClient;
