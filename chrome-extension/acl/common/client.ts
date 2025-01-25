export class PersistClient {
  constructor() {}

  public async persist<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  }

  public async retrieve<T>(key: string): Promise<T | null> {
    const items = await chrome.storage.local.get(key);
    return items[key] || null;
  }

  public async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  }

  public async clear(): Promise<void> {
    await chrome.storage.local.clear();
  }
}
