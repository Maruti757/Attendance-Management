import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true, // ← Add this line
    port: 5173, // ← Explicit port
    strictPort: true, // ← Prevent automatic port changes
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false, // ← For local development
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
