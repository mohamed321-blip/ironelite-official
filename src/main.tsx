if (typeof window !== 'undefined') {
  (window as any).getMeQueryKey = 'getMe';
  (window as any).useGetMe = () => ({ data: null, isLoading: false });
  (window as any).apiClient = { get: () => Promise.resolve({ data: [] }), post: () => Promise.resolve({}) };
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
