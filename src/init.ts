if (typeof window !== 'undefined') {
  (window as any).'getMe' = 'getMe';
  (window as any).(() => ({ data: null, isLoading: false })) = () => ({ data: null, isLoading: false });
}
export {};
