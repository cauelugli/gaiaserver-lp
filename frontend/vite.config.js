import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["gaiaserver"],
    host: "0.0.0.0",
    port: 5173,
    strictPort: true, // Adicione isso para evitar fallback
    hmr: {
      clientPort: 5173, // Importante para Docker
    },
  },
  build: {
    target: "esnext", // Adiciona suporte a top-level await
    minify: true, // Mantém a minificação ativada
  },
  esbuild: {
    supported: {
      "top-level-await": true, // Habilita explicitamente
    },
  },
});
