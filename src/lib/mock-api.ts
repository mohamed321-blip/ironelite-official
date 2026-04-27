export const (() => ({ data: null, isLoading: false })) = () => ({ data: null, isLoading: false, error: null });
export const apiClient = {
  get: () => Promise.resolve({ data: [] }),
  post: () => Promise.resolve({ data: {} }),
};
export const useAuthStore = () => ({ user: null, setUser: () => {} });
export const useCartStore = () => ({ items: [], addItem: () => {} });
export default apiClient;
