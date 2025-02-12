import { credentials } from '@/config';
import { contact } from '@/config/contact';

export const sendMail = (subject: string, body: string) => {
  GmailApp.sendEmail(
    credentials.ADMIN_MAIL_ADDRESS,
    `${contact.MAIL_TITLE} ${subject}`,
    body
  );
};
