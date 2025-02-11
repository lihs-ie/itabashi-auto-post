import { z } from 'zod';
import { useCase as authUseCase } from '../providers/use-cases/authentication';
import { sendMail } from '../aspects/mail';

const pathParameterSchema = z.string().uuid();

export const GET = (
  event: GoogleAppsScript.Events.DoGet
): GoogleAppsScript.Content.TextOutput => {
  try {
    const paths = event.pathInfo.split('/');
    const identifier = pathParameterSchema.parse(paths[1]);

    const active = authUseCase.verify(identifier);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 200, payload: { active } })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log(
      `GETリクエストの処理に失敗しました: ${(error as Error).message}`
    );
    sendMail('GETリクエストの処理に失敗しました', (error as Error).message);
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 500,
        payload: { message: 'Internal server error.' },
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
};
