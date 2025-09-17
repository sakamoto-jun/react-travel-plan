import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  root: "client",
  server: {
    port: 5173, // 프론트 개발 서버 포트
    proxy: {
      "/api": "http://localhost:3000",
      // Express 서버(3000) 로 API 요청 프록시
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@icons": "/src/assets/icons",
    },
  },
});
