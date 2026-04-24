const path = require("path")
const { defineConfig } = require("vitest/config")

const root = __dirname

module.exports = defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    server: {
      deps: {
        inline: ["inversify"]
      }
    }
  },
  resolve: {
    alias: {
      acl: path.resolve(root, "acl"),
      aspects: path.resolve(root, "aspects"),
      background: path.resolve(root, "background"),
      components: path.resolve(root, "components"),
      config: path.resolve(root, "config"),
      contents: path.resolve(root, "contents"),
      domains: path.resolve(root, "domains"),
      infrastructures: path.resolve(root, "infrastructures"),
      popup: path.resolve(root, "popup"),
      providers: path.resolve(root, "providers"),
      tests: path.resolve(root, "tests"),
      "use-cases": path.resolve(root, "use-cases"),
      "@root": root,
      "@tests": path.resolve(root, "tests")
    }
  }
})
