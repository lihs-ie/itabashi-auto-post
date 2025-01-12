import { sendMail } from '../aspects/mail';
import { getProperty } from '../aspects/properties';
import { getTokenOfUserId } from './token/common';

type UserResponse = {
  data: {
    id: string;
  };
};

export const getUserId = (accessToken: string): string => {
  try {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = UrlFetchApp.fetch(getProperty('USER_ENDPOINT'), options);

    const status = response.getResponseCode();
    const content = response.getContentText();

    if (400 <= status) {
      throw new Error(`ユーザー情報の取得に失敗しました: ${content}`);
    }

    const user: UserResponse = JSON.parse(content);

    return user.data.id;
  } catch (error) {
    sendMail('ユーザー情報の取得に失敗しました', (error as Error).message);
    throw error;
  }
};

export const checkLogin = (userId: string): boolean => {
  const account = getTokenOfUserId(userId);

  if (!account) {
    return false;
  }

  return account.expires_in > Date.now();
};
