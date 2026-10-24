/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // The browser only talks to /api on this origin; Vite forwards it to the backend.
    proxy: { "/api": "http://localhost:3000" },
  },
  test: { environment: "jsdom" },
});
