import { credentials } from '@/config';

export const sendMail = (subject: string, body: string) => {
  GmailApp.sendEmail(
    credentials.ADMIN_MAIL_ADDRESS,
    `[itabashi-auto-post] ${subject}`,
    body
  );
};
