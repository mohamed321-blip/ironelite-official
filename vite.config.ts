import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // This is the magic line that fixes the "not defined" error
      "@workspace/api-client-react": path.resolve(__dirname, "./src/shims/api-client-shim.ts"),
    },
  },
});
