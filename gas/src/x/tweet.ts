import { sendMail } from '../aspects/mail';
import { getProperty } from '../aspects/properties';
import { getTokenOfUserId } from './token/common';

export const postTweet = (
  userId: string,
  tweet: string
): GoogleAppsScript.Content.TextOutput => {
  try {
    const payload = {
      text: tweet,
    };

    const token = getTokenOfUserId(userId);

    if (!token) {
      throw new Error(`userId: ${userId} に対応するトークンが見つかりません`);
    }

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    };

    const response = UrlFetchApp.fetch(getProperty('TWEET_ENDPOINT'), options);

    const status = response.getResponseCode();

    if (400 <= status) {
      throw new Error(response.getContentText());
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    sendMail('ツイートに失敗しました', (error as Error).message);
    throw error;
  }
};
