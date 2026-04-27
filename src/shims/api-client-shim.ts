export const useGetMe = () => ({ data: null, isLoading: false, error: null });
export const apiClient = {
  get: () => Promise.resolve({ data: [] }),
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} }),
};
export default apiClient;
