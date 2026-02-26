import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Atualiza o app no celular do usuário automaticamente quando você lança versão nova
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
      ],
      manifest: {
        name: "Cash$Flow",
        short_name: "CashFlow",
        description: "Seu assistente financeiro inteligente",
        theme_color: "#22c55e", // Cor da barra de status no topo do celular (verde do seu app)
        background_color: "#f3f4f6", // Cor de fundo na tela de carregamento (gray-100)
        display: "standalone", // ISSO AQUI é o que esconde a barra do navegador e deixa com cara de App nativo!
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Ajuda o Android a moldar o ícone perfeitamente
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
