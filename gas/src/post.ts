import { sendMail } from './aspects/mail';
import { getProperty } from './aspects/properties';
import { issueToken } from './x/token/issue';
import { postTweet } from './x/tweet';

type Action = 'issueToken' | 'postTweet';

type Payload = {
  action: Action;
  code?: string;
  tweet?: string;
  userId?: string;
  password: string;
};

export const POST = (
  e: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  try {
    const payload = JSON.parse(e.postData.contents) as Payload;

    if (getProperty('GAS_PASSWORD') !== payload.password) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: 'Invalid Request.' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    switch (payload.action) {
      case 'issueToken':
        return issueToken(payload.code!);

      case 'postTweet':
        return postTweet(payload.userId!, payload.tweet!);

      default:
        throw new Error(`Unknown action: ${payload.action}`);
    }
  } catch (error) {
    sendMail('POSTリクエストの処理に失敗しました', (error as Error).message);
    throw error;
  }
};
