import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["gaiaserver"], // Permite o host "gaiaserver"
    host: "0.0.0.0", // Permite acesso de qualquer IP (útil para desenvolvimento)
    port: 5173, // Certifique-se de que o Vite está rodando na porta 5173
  },
});
