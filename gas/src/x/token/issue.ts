import { sendMail } from '../../aspects/mail';
import { getAllProperties } from '../../aspects/properties';
import { getUserId } from '../user';
import { persistTokenResponse, TokenResponse } from './common';

type Properties = [
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  endpoint: string,
];

type Payload = {
  grant_type: string;
  code: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
  code_verifier: string;
};

export const issueToken = (
  code: string
): GoogleAppsScript.Content.TextOutput => {
  try {
    const [clientId, clientSecret, redirectUri, endpoint] =
      getAllProperties<Properties>(
        'OAUTH_CLIENT_ID',
        'OAUTH_CLIENT_SECRET',
        'OAUTH_REDIRECT_URI',
        'OAUTH_TOKEN_ENDPOINT'
      );

    const payload: Payload = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: 'challenge',
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
      throw new Error(
        `トークンの発行に失敗しました: ${response.getContentText()}`
      );
    }

    const tokens: TokenResponse = JSON.parse(response.getContentText());

    const userId = getUserId(tokens.access_token);

    persistTokenResponse(userId, tokens);

    return ContentService.createTextOutput(
      JSON.stringify({ userId })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    sendMail('トークンの発行に失敗しました', (error as Error).message);
    throw error;
  }
};
