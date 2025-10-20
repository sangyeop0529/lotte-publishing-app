import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 외부 접속 허용
    port: 5173,
    hmr: {
      host: "localhost", // 또는 실제 IP
      protocol: "ws",
    },
  },
});
