import { create } from 'zustand';

type CartStore = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));

type AuthStore = {
  isOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isOpen: false,
  openAuth: () => set({ isOpen: true }),
  closeAuth: () => set({ isOpen: false }),
}));
