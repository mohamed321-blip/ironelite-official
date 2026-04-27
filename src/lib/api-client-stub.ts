// Replace with real implementations as needed

export const useCart = () => ({ items: [], addItem: () => {}, removeItem: () => {} });
export const useOrders = () => ({ orders: [], loading: false });
export const useProducts = () => ({ products: [], loading: false });
export const useAuth = () => ({ user: null, login: () => {}, logout: () => {} });
export class ApiClient { static get() { return null; } }
