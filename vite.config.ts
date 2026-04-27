import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    // This forces the compiler to treat these names as these values
    'getMeQueryKey': JSON.stringify('getMe'),
    'useGetMe': '(() => ({ data: null, isLoading: false }))',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
