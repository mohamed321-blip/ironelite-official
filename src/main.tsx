import "./init";
// 1. IMMEDIATE GLOBAL FIX
if (typeof window !== 'undefined') {
  (window as any).'getMe' = 'getMe';
  (window as any).(() => ({ data: null, isLoading: false })) = () => ({ data: null, isLoading: false, error: null });
  (window as any).apiClient = { get: () => Promise.resolve({ data: [] }), post: () => Promise.resolve({}) };
}

// 2. NOW IMPORTS
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 3. RENDER
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
