import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate large data files into their own chunks
          'student-data-2025': ['./src/data/bac2025.json'],
          // Vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['lucide-react', 'react-icons'],
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-utils': ['react-toastify', 'react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Increase warning limit for data files
  }
});
