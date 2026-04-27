// THIS MUST BE THE FIRST BIT OF CODE EXECUTED
const safetyNet = () => {
  if (typeof window !== 'undefined') {
    (window as any).getMeQueryKey = 'getMe';
    (window as any).useGetMe = () => ({ data: null, isLoading: false, error: null });
    (window as any).apiClient = { 
      get: () => Promise.resolve({ data: [] }), 
      post: () => Promise.resolve({ data: {} }) 
    };
    (window as any).useAuthStore = () => ({ user: null, setUser: () => {} });
    (window as any).useCartStore = () => ({ items: [], addItem: () => {} });
  }
};
safetyNet();

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
