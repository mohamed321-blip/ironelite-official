// Global safety net for missing Replit/Workspace variables
if (typeof window !== 'undefined') {
  (window as any).getMeQueryKey = 'getMe';
  (window as any).useGetMe = () => ({ data: null, isLoading: false, error: null });
  (window as any).apiClient = {
    get: () => Promise.resolve({ data: [] }),
    post: () => Promise.resolve({ data: {} }),
    put: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({ data: {} }),
  };
}
export {};
