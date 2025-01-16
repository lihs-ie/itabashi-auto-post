import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

type Environment = "development" | "production";

const transformManifest = (mode: Environment, contents: string) => {
  const env = loadEnv(mode, process.cwd());

  return contents.replace(/\$\{process\.env\.(\w+)\}/g, (_, key) => {
    const value = env[key];

    if (key === "VITE_OAUTH_SCOPES") {
      return value
        .split(" ")
        .map((scope) => scope)
        .join(", ");

      // return value.split(" ").join(",");
    }

    return env[key] || "";
  });
};

export default defineConfig(({ mode }) => {
  if (mode !== "development" && mode !== "production") {
    throw new Error("Invalid mode: " + mode);
  }

  const distName = mode === "development" ? "dist-dev" : "dist-prd";

  return {
    base: "./",
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: "manifest.json",
            dest: ".",
            transform: (contents) => transformManifest(mode, contents),
          },
        ],
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
      outDir: resolve(__dirname, distName),
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
