if (typeof window !== 'undefined') {
  (window as any).'getMe' = 'getMe';
  (window as any).(() => ({ data: null, isLoading: false })) = () => ({ data: null, isLoading: false, error: null });
  (window as any).apiClient = {
    get: () => Promise.resolve({ data: [] }),
    post: () => Promise.resolve({ data: {} }),
    put: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({ data: {} }),
  };
}
export {};
