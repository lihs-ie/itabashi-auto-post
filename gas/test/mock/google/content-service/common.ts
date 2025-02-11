enum MimeType {
  ATOM,
  CSV,
  ICAL,
  JAVASCRIPT,
  JSON,
  RSS,
  TEXT,
  VCARD,
  XML,
}

export class TextOutputMock implements GoogleAppsScript.Content.TextOutput {
  private MimeType: GoogleAppsScript.Content.MimeType =
    MimeType.TEXT as GoogleAppsScript.Content.MimeType;
  private content: string = '';

  constructor(content: string = '') {
    this.content = content;
  }

  append(addedContent: string): GoogleAppsScript.Content.TextOutput {
    throw new Error('Method not implemented.');
  }

  clear(): GoogleAppsScript.Content.TextOutput {
    throw new Error('Method not implemented.');
  }

  downloadAsFile(filename: string): GoogleAppsScript.Content.TextOutput {
    throw new Error('Method not implemented.');
  }

  getContent(): string {
    return this.content;
  }

  getFileName(): string {
    throw new Error('Method not implemented.');
  }

  getMimeType(): GoogleAppsScript.Content.MimeType {
    return this.MimeType;
  }

  setContent(content: string): GoogleAppsScript.Content.TextOutput {
    throw new Error('Method not implemented.');
  }

  setMimeType(
    mimeType: GoogleAppsScript.Content.MimeType
  ): GoogleAppsScript.Content.TextOutput {
    this.MimeType = mimeType;
    return this;
  }
}

export class ContentServiceMock
  implements GoogleAppsScript.Content.ContentService
{
  MimeType: typeof GoogleAppsScript.Content.MimeType;

  constructor() {
    this.MimeType = MimeType as any;
  }

  createTextOutput(content?: unknown): GoogleAppsScript.Content.TextOutput {
    return new TextOutputMock(content as string);
  }
}
