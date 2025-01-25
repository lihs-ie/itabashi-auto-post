export class LocalStorageMock implements chrome.storage.LocalStorageArea {
  QUOTA_BYTES: number = 5242880
  public store: { [key: string]: any }

  public constructor(initial: { [key: string]: any } = {}) {
    this.store = { ...initial }
  }

  // @ts-ignore
  getBytesInUse<T = { [key: string]: any }>(
    _keys?: keyof T | (keyof T)[] | null,
    _callback?: (bytesInUse: number) => void
  ): void | Promise<number> {
    throw new Error("Method not implemented.")
  }

  // @ts-ignore
  get<T = { [key: string]: any }>(
    keys?: keyof T | Array<keyof T> | null
  ): Promise<T> {
    if (keys) {
      const result: Partial<T> = {}
      if (Array.isArray(keys)) {
        keys.forEach((key) => {
          if (key in this.store) {
            // @ts-ignore
            result[key] = this.store[key]
          }
        })
      } else {
        if (keys in this.store) {
          // @ts-ignore
          result[keys] = this.store[keys]
        }
      }
      return Promise.resolve(result as T)
    }
    return Promise.resolve(this.store as T)
  }

  set<T = { [key: string]: any }>(items: Partial<T>): Promise<void> {
    Object.keys(items).forEach((key) => {
      // @ts-ignore
      this.store[key] = items[key]
    })
    return Promise.resolve()
  }

  remove<T = { [key: string]: any }>(
    keys: keyof T | Array<keyof T>
  ): Promise<void> {
    if (Array.isArray(keys)) {
      // @ts-ignore
      keys.forEach((key) => delete this.store[key])
    } else {
      // @ts-ignore
      delete this.store[keys]
    }
    return Promise.resolve()
  }

  clear(): Promise<void> {
    this.store = {}
    return Promise.resolve()
  }

  // @ts-ignore
  onChanged: chrome.storage.StorageAreaChangedEvent = (changes, areaName) => {}

  // getKeys: ストレージのすべてのキーを取得
  getKeys(): Promise<string[]> {
    return Promise.resolve(Object.keys(this.store))
  }

  // setAccessLevel: アクセスレベルを設定（モックのため実装しない）
  setAccessLevel(_: { accessLevel: any }): Promise<void> {
    return Promise.resolve()
  }
}
