import path from "path"
import { defineConfig } from "vitest/config"

/// <reference types="vitest" />
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    alias: {
      "^acl/(.*)$": "/src/acl/$1",
      "^aspects/(.*)$": "/src/aspects/$1",
      "^config(.*)$": "/src/config/$1",
      "^domains(.*)$": "/src/domains/$1",
      "^extensions(.*)$": "/src/extensions/$1",
      "^infrastructures(.*)$": "/src/infrastructures/$1",
      "^tests(.*)$": "/src/tests/$1",
      "^components(.*)$": "/src/components/$1"
    },
    transformIgnorePatterns: ["/node_modules/(?!inversify)"],
    setupFiles: ["./vitest.setup.ts"]
  },
  esbuild: {
    tsconfigRaw: require("./tsconfig.json")
  },
  resolve: {
    alias: {
      "@root": path.resolve(__dirname),
      "@tests": path.resolve(__dirname, "tests")
    }
  }
})
