"use strict"

const prettierConfig = require("eslint-config-prettier")
const prettierPlugin = require("eslint-plugin-prettier")
const storybookPlugin = require("eslint-plugin-storybook")

module.exports = [
  {
    ignores: [
      "**/node_modules/**",
      "build/**",
      "**/dist/**",
      "testing/**",
      ".plasmo/**",
      "after-build/**",
      "tests/**",
      ".storybook/**",
      "*.tsbuildinfo"
    ]
  },
  prettierConfig,
  ...storybookPlugin.configs["flat/recommended"],
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      "prettier/prettier": "error"
    }
  }
]
