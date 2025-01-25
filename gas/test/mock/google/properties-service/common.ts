import { ScriptPropertyMock } from './script-property';

export class PropertiesServiceMock
  implements GoogleAppsScript.Properties.PropertiesService
{
  private scriptProperties: GoogleAppsScript.Properties.ScriptProperties;

  constructor(scriptProperties: ScriptPropertyMock) {
    this.scriptProperties = scriptProperties;
  }

  getScriptProperties(): GoogleAppsScript.Properties.ScriptProperties {
    return this.scriptProperties;
  }

  getUserProperties(): GoogleAppsScript.Properties.UserProperties {
    throw new Error('Method not implemented.');
  }

  getDocumentProperties(): GoogleAppsScript.Properties.Properties {
    throw new Error('Method not implemented.');
  }
}
