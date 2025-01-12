export const OAuth = {
  CLIENT_ID: import.meta.env.VITE_OAUTH_CLIENT_ID || "",
  REDIRECT_URI: import.meta.env.VITE_OAUTH_REDIRECT_URI || "",
  AUTHORIZATION_ENDPOINT: import.meta.env.VITE_OAUTH_AUTHORIZATION_ENDPOINT || "",
  TOKEN_ENDPOINT: import.meta.env.VITE_OAUTH_TOKEN_ENDPOINT || "",
  TWEET_ENDPOINT: import.meta.env.VITE_TWEET_ENDPOINT || "",
  GAS_PASSWORD: import.meta.env.VITE_GAS_PASSWORD || "",
} as const;
