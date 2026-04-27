import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    // Replace variable names with their actual values during build
    'getMeQueryKey': '"getMe"',
    'useGetMe': '(() => ({ data: null, isLoading: false }))',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
