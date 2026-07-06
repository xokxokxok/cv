import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Polling is required for file-change detection on Windows bind mounts.
    watch: { usePolling: true },
  },
});
