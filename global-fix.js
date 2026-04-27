if (typeof window !== 'undefined') {
  window.useGetMe = window.useGetMe || (() => ({ data: null, isLoading: false }));
  window.getMeQueryKey = window.getMeQueryKey || 'getMe';
  window.apiClient = window.apiClient || { get: () => Promise.resolve({ data: [] }), post: () => Promise.resolve({}) };
}
