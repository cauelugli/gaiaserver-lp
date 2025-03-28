import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, 
    },
    cors: true,
  },
  build: {
    target: "esnext",
    minify: true,
    outDir: "../dist",
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
});
