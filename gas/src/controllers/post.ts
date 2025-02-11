import { z } from 'zod';
import { sendMail } from '../aspects/mail';
import { useCase as authUseCase } from '../providers/use-cases/authentication';
import { useCase as messageUseCase } from '../providers/use-cases/message';
import { useCase as credentialUseCase } from '../providers/use-cases/credential';

export const Action = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SEND_MESSAGE: 'sendMessage',
} as const;

type Action = (typeof Action)[keyof typeof Action];

const loginSchema = z.object({
  code: z.object({
    value: z.string().min(1).max(100),
    verifier: z.string().min(43).max(128),
  }),
  password: z.string().min(1),
});

const logoutSchema = z.object({
  authentication: z.string().min(1),
  password: z.string().min(1),
});

const sendMessageSchema = z.object({
  identifier: z.string().min(1),
  authentication: z.string().min(1),
  content: z.string().min(1),
  password: z.string().min(1),
});

const eventSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal(Action.LOGIN),
    payload: loginSchema,
  }),
  z.object({
    action: z.literal(Action.LOGOUT),
    payload: logoutSchema,
  }),
  z.object({
    action: z.literal(Action.SEND_MESSAGE),
    payload: sendMessageSchema,
  }),
]);

const login = (code: {
  value: string;
  verifier: string;
}): GoogleAppsScript.Content.TextOutput => {
  const authentication = authUseCase.login(code.value, code.verifier);

  return ContentService.createTextOutput(
    JSON.stringify({
      status: 200,
      payload: { authentication: authentication.value },
    })
  ).setMimeType(ContentService.MimeType.JSON);
};

const logout = (
  authentication: string
): GoogleAppsScript.Content.TextOutput => {
  authUseCase.remove(authentication);

  return ContentService.createTextOutput(JSON.stringify({ status: 200 }));
};

const sendMessage = (
  identifier: string,
  authentication: string,
  content: string
): GoogleAppsScript.Content.TextOutput => {
  messageUseCase.send(identifier, authentication, content);

  return ContentService.createTextOutput(JSON.stringify({ status: 200 }));
};

export const POST = (
  event: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  try {
    const contents = event.postData.contents;
    Logger.log('DoPost received content.: %s', contents);

    const body = eventSchema.parse(JSON.parse(contents));

    const verification = credentialUseCase.verify(body.payload.password);

    if (!verification) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 400, payload: { message: 'Bad Request.' } })
      ).setMimeType(ContentService.MimeType.TEXT);
    }

    const { action, payload } = body;

    switch (action) {
      case 'login':
        return login(payload.code);
      case 'logout':
        return logout(payload.authentication);
      case 'sendMessage':
        return sendMessage(
          payload.identifier,
          payload.authentication,
          payload.content
        );
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    Logger.log('DoPost error: %s', error);
    sendMail('POSTリクエストの処理に失敗しました', (error as Error).message);

    if (error instanceof z.ZodError) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 400, payload: { message: 'Bad Request.' } })
      ).setMimeType(ContentService.MimeType.TEXT);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 500,
        payload: { message: 'Internal server error.' },
      })
    ).setMimeType(ContentService.MimeType.TEXT);
  }
};
