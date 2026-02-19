import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Aqui dizemos para o Vite como ele deve "empacotar" o projeto
    rollupOptions: {
      output: {
        manualChunks: {
          // 1. Pega tudo que é do React e coloca num pacote chamado 'vendor'
          vendor: ["react", "react-dom", "react-router-dom"],

          // 2. Pega tudo que é do Firebase e coloca num pacote separado chamado 'firebase'
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
    // Opcional: Avisa o Vite para não reclamar se um arquivo ficar um pouquinho grande
    chunkSizeWarningLimit: 800,
  },
});
