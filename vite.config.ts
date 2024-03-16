import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsConfigPaths()],
  server: {
    port: parseInt(process.env.VITE_PORT, 10) || 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          emptyApi: ["./src/services/emptyApi"],
          "react-router-dom": ["react-router-dom"],
          "@mantine/core": ["@mantine/core"],
          "@mantine/hooks": ["@mantine/hooks"],
          "@mantine/dates": ["@mantine/dates"],
          "@mantine/notifications": ["@mantine/notifications"],
          "@mantine/rte": ["@mantine/rte"],
        },
      },
    },
  },
});
