import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all IPs to allow external access
    port: 3000, // Specify the port
    strictPort: true, // Fail if the port is already in use
    watch: {
      usePolling: true, // Ensure file changes are detected in Docker environments
    },
  },
});
