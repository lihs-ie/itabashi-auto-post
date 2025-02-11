const property = PropertiesService.getScriptProperties().getProperties();

export const x = {
  oauth: {
    REDIRECT_URI: property['OAUTH_REDIRECT_URI'] || 'http://localhost',
    CLIENT_ID: property['OAUTH_CLIENT_ID'] || 'client_id',
    CLIENT_SECRET: property['OAUTH_CLIENT_SECRET'] || 'client_secret',
    TOKEN_ENDPOINT: property['OAUTH_TOKEN_ENDPOINT'] || 'http://localhost/api',
  },
  API_ENDPOINT: property['X_API_ENDPOINT'] || 'http://localhost/api',
  user: {
    API_ENDPOINT: property['USER_API_ENDPOINT'] || 'http://localhost/api',
  },
} as const;
