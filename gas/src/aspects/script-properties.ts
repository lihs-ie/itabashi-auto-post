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
  USERS: 'USERS',
  AUTHENTICATIONS: 'AUTHENTICATIONS',
} as const;

export type Properties = (typeof properties)[keyof typeof properties];

export type PersistClient<T extends { [key in string]: string }> = {
  find: (key: T[keyof T], throwOnMissing?: boolean) => string | null;
  persist: (key: T[keyof T], value: string) => void;
};

export const persistClient = <
  T extends { [key in string]: string },
>(): PersistClient<T> => {
  const find: PersistClient<T>['find'] = (key, throwOnMissing = true) => {
    const store = PropertiesService.getScriptProperties();
    const value = store.getProperty(key);

    if (value === null) {
      if (throwOnMissing) {
        throw new Error(`Property ${key} not found.`);
      }

      return null;
    } else {
      return value;
    }
  };

  const persist: PersistClient<T>['persist'] = (key, value) => {
    const store = PropertiesService.getScriptProperties();

    store.setProperty(key, value);
  };

  return { find, persist };
};
