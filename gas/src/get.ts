import { sendMail } from './aspects/mail';
import { checkLogin } from './x/user';

export const GET = (
  e: GoogleAppsScript.Events.DoGet
): GoogleAppsScript.Content.TextOutput => {
  try {
    const parameter = e.parameter;
    const userId = parameter.userId;

    const isLogin = checkLogin(userId);

    return ContentService.createTextOutput(
      JSON.stringify({ isLogin })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    sendMail('GETリクエストの処理に失敗しました', (error as Error).message);
    throw error;
  }
};
