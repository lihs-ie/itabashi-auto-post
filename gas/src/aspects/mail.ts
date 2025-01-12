import { getProperty } from './properties';

export const sendMail = (subject: string, body: string) => {
  GmailApp.sendEmail(
    getProperty('ADMIN_MAIL_ADDRESS'),
    `[itabashi-auto-post] ${subject}`,
    body
  );
};
