export class ScriptPropertyMock
  implements GoogleAppsScript.Properties.ScriptProperties
{
  private properties: { [key: string]: any } = {};

  constructor(initial: { [key: string]: any } = {}) {
    this.properties = initial;
  }

  deleteAllProperties(): GoogleAppsScript.Properties.ScriptProperties {
    this.properties = {};
    return this;
  }

  deleteProperty(key: string): GoogleAppsScript.Properties.ScriptProperties {
    delete this.properties[key];
    return this;
  }

  getKeys(): string[] {
    return Object.keys(this.properties);
  }

  getProperties(): { [key: string]: string } {
    return this.properties;
  }

  getProperty(key: string): string | null {
    return this.properties[key] || null;
  }

  setProperties(
    properties: unknown,
    deleteAllOthers?: unknown
  ): GoogleAppsScript.Properties.ScriptProperties {
    if (deleteAllOthers) {
      this.properties = properties as { [key: string]: string };
    } else {
      this.properties = {
        ...this.properties,
        ...(properties as { [key: string]: string }),
      };
    }

    return this;
  }

  setProperty(
    key: string,
    value: string
  ): GoogleAppsScript.Properties.ScriptProperties {
    this.properties[key] = value;
    return this;
  }
}
