import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  root: './',  // 显式指定根目录
  plugins: [tailwindcss(), react()],
});