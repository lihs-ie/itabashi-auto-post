export class MockScriptProperties {
  public static store: Record<string, string> = {};

  static setInitialStore(initialStore: Record<string, string> = {}): void {
    MockScriptProperties.store = { ...initialStore };
  }

  static getInstance(): MockScriptProperties {
    return new MockScriptProperties();
  }

  private constructor() {}

  getProperty(key: string): string | null {
    return MockScriptProperties.store[key] || null;
  }

  setProperty(key: string, value: string): void {
    MockScriptProperties.store[key] = value;
  }

  deleteProperty(key: string): void {
    delete MockScriptProperties.store[key];
  }

  getKeys(): string[] {
    return Object.keys(MockScriptProperties.store);
  }

  reset(initialStore: Record<string, string> = {}): void {
    MockScriptProperties.store = { ...initialStore };
  }
}
