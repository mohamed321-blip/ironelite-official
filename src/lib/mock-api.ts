export const apiClient = {
  get: () => Promise.resolve({ data: [] }),
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} }),
};
export const useAuthStore = () => ({ user: null });
export const useCartStore = () => ({ items: [] });
export default apiClient;
