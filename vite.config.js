import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,  // 强制使用项目根目录的绝对路径
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',
    port: 8976,
    allowedHosts: ['*']
  }
});