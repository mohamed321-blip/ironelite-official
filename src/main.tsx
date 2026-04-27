import "./globals";
if (typeof window !== 'undefined') {
  window.useGetMe = window.useGetMe || (() => ({ data: null, isLoading: false }));
  window.getMeQueryKey = window.getMeQueryKey || 'getMe';
  window.apiClient = window.apiClient || { get: () => Promise.resolve({ data: [] }), post: () => Promise.resolve({}) };
}
window.useGetMe = () => ({ data: null, isLoading: false });
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
