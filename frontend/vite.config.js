import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [reactRouter()],
  optimizeDeps: {
    include: ["pdfjs-dist/legacy/build/pdf.mjs"],
  },
});
