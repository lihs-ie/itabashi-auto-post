import { LoggerMock } from './logger';
import { ScriptPropertyMock } from './properties-service/script-property';
import { UrlFetchAppMock } from './url-fetch-app';
import { UtilitiesMock } from './utilities/common';

export const useLoggerMock = () => {
  beforeEach(() => {
    global.Logger = new LoggerMock();
  });
};

export const useScriptPropertiesMock = (
  initial: { [key: string]: string } = {}
) =>
  beforeEach(() => {
    global.PropertiesService = {
      getScriptProperties: jest.fn(() => new ScriptPropertyMock(initial)),
    } as any;
  });

export const useUrlFetchAppMock = () => {
  beforeEach(() => {
    global.UrlFetchApp = new UrlFetchAppMock();
  });
};

export const useUtilitiesMock = () => {
  beforeEach(() => {
    global.Utilities = new UtilitiesMock();
  });
};

export const useAllMocks = () => {
  useLoggerMock();
  useScriptPropertiesMock();
  useUrlFetchAppMock();
  useUtilitiesMock();
};
