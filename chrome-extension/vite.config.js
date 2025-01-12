import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig((opt) => {
  return {
    base: "./",
    plugins: [
      react(),
      viteStaticCopy({
        targets: [{ src: __dirname + "/manifest.json", dest: "." }],
      }),
    ],

    resolve: {
      alias: {
        components: resolve(__dirname, "src/components"),
        aspects: resolve(__dirname, "src/aspects"),
        public: resolve(__dirname, "public"),
        config: resolve(__dirname, "src/config"),
      },
    },
    build: {
      target: "esnext",
      outDir: resolve(__dirname, "dist"),
      rollupOptions: {
        input: {
          popup: resolve(__dirname, "src/pages/popup/index.html"),
          content: resolve(__dirname, "src/extensions/content.ts"),
          background: resolve(__dirname, "src/extensions/background.ts"),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
        },
      },
    },
  };
});
