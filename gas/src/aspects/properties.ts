const properties = {
  GAS_PASSWORD: 'GAS_PASSWORD',
  OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
  OAUTH_CLIENT_SECRET: 'OAUTH_CLIENT_SECRET',
  OAUTH_REDIRECT_URI: 'OAUTH_REDIRECT_URI',
  OAUTH_TOKEN_ENDPOINT: 'OAUTH_TOKEN_ENDPOINT',
  TWEET_ENDPOINT: 'TWEET_ENDPOINT',
  TWITTER_ACCOUNTS: 'TWITTER_ACCOUNTS',
  USER_ENDPOINT: 'USER_ENDPOINT',
  ADMIN_MAIL_ADDRESS: 'ADMIN_MAIL_ADDRESS',
} as const;

export type Properties = (typeof properties)[keyof typeof properties];

const store = PropertiesService.getScriptProperties();

export const getProperty = (key: Properties): string => {
  const value = store.getProperty(key);

  if (value === null) {
    throw new Error(`Property ${key} not found`);
  }

  return value;
};

export const getAllProperties = <T>(...keys: Array<Properties>): T => {
  return keys.map(key => getProperty(key)!) as T;
};

export const setProperty = (key: string, value: string) => {
  store.setProperty(key, value);
};
