import { sendMail } from '../../aspects/mail';
import { getAllProperties, getProperty } from '../../aspects/properties';
import { Account, persistTokenResponse, removeToken } from './common';

type Properties = [clientId: string, clientSecret: string, endpoint: string];

const refresh = (userId: string, refreshToken: string): void => {
  const [clientId, clientSecret, endpoint] = getAllProperties<Properties>(
    'OAUTH_CLIENT_ID',
    'OAUTH_CLIENT_SECRET',
    'OAUTH_TOKEN_ENDPOINT'
  );

  const payload = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  };

  const authorization = Utilities.base64Encode(`${clientId}:${clientSecret}`);

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: Object.entries(payload)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&'),
    headers: {
      Authorization: `Basic ${authorization}`,
    },
  };

  const response = UrlFetchApp.fetch(endpoint, options);

  const status = response.getResponseCode();

  if (400 <= status) {
    throw new Error(`トークン更新に失敗しました: ${response.getContentText()}`);
  }

  const tokens = JSON.parse(response.getContentText());

  persistTokenResponse(userId, tokens);
};

export const allRefresh = () => {
  const accounts: Array<Account> = JSON.parse(getProperty('TWITTER_ACCOUNTS'));

  accounts.forEach(account => {
    const userId = Object.keys(account)[0];
    const tokens = account[userId];

    try {
      refresh(userId, tokens.refresh_token);
    } catch (error) {
      if (tokens.refreshRetryCount >= 3) {
        removeToken(userId);
        return;
      }

      persistTokenResponse(userId, {
        ...tokens,
        refreshRetryCount: tokens.refreshRetryCount + 1,
      });
      sendFailureMail(userId, error as Error);
    }
  });
};

const sendFailureMail = (userId: string, error: Error) => {
  sendMail(
    'トークン更新に失敗しました',
    `error: ${error.message}\n userId: ${userId}`
  );
};
