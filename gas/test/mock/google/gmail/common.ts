export class GmailAppMock implements GoogleAppsScript.Gmail.GmailApp {
  private sentEmails: { recipient: string; subject: string; body: string }[] =
    [];

  sendEmail(
    recipient: string,
    subject: string,
    body: string
  ): GoogleAppsScript.Gmail.GmailApp {
    this.sentEmails.push({ recipient, subject, body });
    return this;
  }

  getSentEmails(): { recipient: string; subject: string; body: string }[] {
    return this.sentEmails;
  }

  createDraft(
    recipient: unknown,
    subject: unknown,
    body: unknown,
    options?: unknown
  ): GoogleAppsScript.Gmail.GmailDraft {
    throw new Error('Method not implemented.');
  }

  createLabel(name: unknown): GoogleAppsScript.Gmail.GmailLabel {
    throw new Error('Method not implemented.');
  }

  deleteLabel(label: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  getAliases(): string[] {
    throw new Error('Method not implemented.');
  }

  getChatThreads(
    start?: unknown,
    max?: unknown
  ): GoogleAppsScript.Gmail.GmailThread[] {
    throw new Error('Method not implemented.');
  }

  getDraft(draftId: unknown): GoogleAppsScript.Gmail.GmailDraft {
    throw new Error('Method not implemented.');
  }

  getDraftMessages(): GoogleAppsScript.Gmail.GmailMessage[] {
    throw new Error('Method not implemented.');
  }

  getDrafts(): GoogleAppsScript.Gmail.GmailDraft[] {
    throw new Error('Method not implemented.');
  }

  getInboxThreads(
    start?: unknown,
    max?: unknown
  ): GoogleAppsScript.Gmail.GmailThread[] {
    throw new Error('Method not implemented.');
  }

  getInboxUnreadCount(): number {
    throw new Error('Method not implemented.');
  }

  getMessageById(id: unknown): GoogleAppsScript.Gmail.GmailMessage {
    throw new Error('Method not implemented.');
  }

  getMessagesForThread(thread: unknown): GoogleAppsScript.Gmail.GmailMessage[] {
    throw new Error('Method not implemented.');
  }

  getMessagesForThreads(
    threads: unknown
  ): GoogleAppsScript.Gmail.GmailMessage[][] {
    throw new Error('Method not implemented.');
  }

  getPriorityInboxThreads(
    start?: unknown,
    max?: unknown
  ): GoogleAppsScript.Gmail.GmailThread[] {
    throw new Error('Method not implemented.');
  }

  getPriorityInboxUnreadCount(): number {
    throw new Error('Method not implemented.');
  }

  getSpamThreads(
    start?: unknown,
    max?: unknown
  ): GoogleAppsScript.Gmail.GmailThread[] {
    throw new Error('Method not implemented.');
  }

  getSpamUnreadCount(): number {
    throw new Error('Method not implemented.');
  }

  getStarredThreads(
    start?: unknown,
    max?: unknown
  ): GoogleAppsScript.Gmail.GmailThread[] {
    throw new Error('Method not implemented.');
  }

  getStarredUnreadCount(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }

  getThreadById(id: unknown): GoogleAppsScript.Gmail.GmailThread {
    throw new Error('Method not implemented.');
  }

  getTrashThreads(
    start?: unknown,
    max?: unknown
  ): GoogleAppsScript.Gmail.GmailThread[] {
    throw new Error('Method not implemented.');
  }

  getUserLabelByName(name: unknown): GoogleAppsScript.Gmail.GmailLabel {
    throw new Error('Method not implemented.');
  }

  getUserLabels(): GoogleAppsScript.Gmail.GmailLabel[] {
    throw new Error('Method not implemented.');
  }

  markMessageRead(message: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markMessageUnread(message: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markMessagesRead(messages: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markMessagesUnread(messages: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markThreadImportant(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markThreadRead(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markThreadUnimportant(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markThreadUnread(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markThreadsImportant(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markThreadsRead(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markThreadsUnimportant(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  markThreadsUnread(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveMessageToTrash(message: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveMessagesToTrash(messages: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveThreadToArchive(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveThreadToInbox(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveThreadToSpam(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveThreadToTrash(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveThreadsToArchive(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveThreadsToInbox(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveThreadsToSpam(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  moveThreadsToTrash(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  refreshMessage(message: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  refreshMessages(messages: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  refreshThread(thread: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  refreshThreads(threads: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  search(
    query: unknown,
    start?: unknown,
    max?: unknown
  ): GoogleAppsScript.Gmail.GmailThread[] {
    throw new Error('Method not implemented.');
  }

  setCurrentMessageAccessToken(accessToken: unknown): void {
    throw new Error('Method not implemented.');
  }

  starMessage(message: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  starMessages(messages: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  unstarMessage(message: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }

  unstarMessages(messages: unknown): GoogleAppsScript.Gmail.GmailApp {
    throw new Error('Method not implemented.');
  }
}
