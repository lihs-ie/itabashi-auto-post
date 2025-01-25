export const itabashiAutoPostGAS = {
  API_ENDPOINT:
    process.env.PLASMO_PUBLIC_ITABASHI_AUTO_POST_GAS_API_ENDPOINT || "",
  PASSWORD: process.env.PLASMO_PUBLIC_ITABASHI_AUTO_POST_GAS_PASSWORD || ""
} as const
