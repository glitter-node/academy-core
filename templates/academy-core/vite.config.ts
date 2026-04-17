import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "AcademyCore",
      formats: ["iife"],
      fileName: () => "components.iife.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: "esbuild",
    target: "es2020",
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        format: "iife",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        entryFileNames: "js/components.iife.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "css/components.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});
