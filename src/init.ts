if (typeof window !== 'undefined') {
  (window as any).getMeQueryKey = 'getMe';
  (window as any).useGetMe = () => ({ data: null, isLoading: false });
}
export {};
