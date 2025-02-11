export const x = {
  CLIENT_ID: process.env.PLASMO_PUBLIC_OAUTH_CLIENT_ID || "client_id",
  REDIRECT_URI:
    process.env.PLASMO_PUBLIC_OAUTH_REDIRECT_URI || "http://localhost",
  AUTHORIZATION_ENDPOINT:
    process.env.PLASMO_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT ||
    "http://localhost/authorize"
} as const
