import { PropertiesServiceMock } from './test/mock/google/properties-service';
import { ScriptPropertyMock } from './test/mock/google/properties-service/script-property';
import { UtilitiesMock } from './test/mock/google/utilities';
import { LoggerMock } from './test/mock/google/logger';
import { UrlFetchAppMock } from './test/mock/google/url-fetch-app';
import { GmailAppMock } from './test/mock/google/gmail';
import { ContentServiceMock } from './test/mock/google/content-service';

global.PropertiesService = new PropertiesServiceMock(new ScriptPropertyMock());

global.Utilities = new UtilitiesMock();

global.Logger = new LoggerMock();

global.UrlFetchApp = new UrlFetchAppMock();

global.GmailApp = new GmailAppMock();

global.ContentService = new ContentServiceMock();
