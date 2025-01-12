import { getProperty, setProperty } from '../../aspects/properties';

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  refreshRetryCount: number;
};

export type Account = {
  [userId: string]: TokenResponse;
};

export const persistTokenResponse = (userId: string, tokens: TokenResponse) => {
  const accounts = JSON.parse(
    getProperty('TWITTER_ACCOUNTS')
  ) as Array<Account>;

  const nextTokens: Account = {
    [userId]: {
      ...tokens,
      expires_in: Date.now() + tokens.expires_in * 1000,
      refreshRetryCount: 0,
    },
  };

  const index = accounts.findIndex(value => Object.keys(value)[0] === userId);

  if (index === -1) {
    accounts.push(nextTokens);
  } else {
    accounts.splice(index, 1, nextTokens);
  }

  setProperty('TWITTER_ACCOUNTS', JSON.stringify(accounts));
};

export const removeToken = (userId: string) => {
  const accounts: Array<Account> = JSON.parse(getProperty('TWITTER_ACCOUNTS'));

  const index = accounts.findIndex(value => Object.keys(value)[0] === userId);

  if (index !== -1) {
    const nextAccounts = [
      ...accounts.slice(0, index),
      ...accounts.slice(index + 1),
    ];

    setProperty('TWITTER_ACCOUNTS', JSON.stringify(nextAccounts));
  }
};

export const getTokenOfUserId = (userId: string): TokenResponse | null => {
  const accounts: Array<Account> = JSON.parse(getProperty('TWITTER_ACCOUNTS'));

  const account = accounts.find(value => Object.keys(value)[0] === userId);

  return account ? account[userId] : null;
};
