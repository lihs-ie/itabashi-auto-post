const fs = require("fs")
const path = require("path")

console.log("🚀 Adding redirect_uri to manifest.json")

const target =
  process.env.NODE_ENV === "development"
    ? "chrome-mv3-dev"
    : "chrome-mv3-production"

const jsonPath = path.resolve(__dirname, `../build/${target}/manifest.json`)

const content = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

content.oauth2["redirect_uri"] =
  "https://fnblmcbgfliopllclifdebjaklkpjpfi.chromiumapp.org/"

fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2), "utf-8")

console.log("📝 Added redirect_uri to manifest.json")
