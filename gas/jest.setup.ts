import { MockScriptProperties } from './test/helpers/properties';

(global as any).PropertiesService = {
  getScriptProperties: () => MockScriptProperties.getInstance(),
};

(global as any).Utilities = {
  base64Encode: (value: string) => btoa(value),
};

(global as any).UrlFetchApp = {
  fetch: jest.fn(),
};

(global as any).MailApp = {
  sendEmail: jest.fn(),
};

(global as any).ContentService = {
  createTextOutput: jest.fn().mockReturnValue({
    setMimeType: jest.fn().mockReturnThis(),
  }),
  MimeType: {
    JSON,
  },
};
