import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 8081,
      protocol: "ws",
      host: "localhost",
    },
    watch: {
      usePolling: true,
    },
    cors: true,
  },
  build: {
    target: "esnext",
    minify: true,
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
});
