import { SerdeOptions, Storage, StorageCallbackMap } from "@plasmohq/storage"

type Properties = {
  area?: "sync" | "local" | "managed" | "session"
  allCopied?: boolean
  copiedKeyList?: string[]
  serde?: SerdeOptions
}

export class PlasmoStorageMock extends Storage {
  private store: Record<string, string>

  constructor(
    initial: Record<string, string> = {},
    properties: Properties = {}
  ) {
    super(properties)
    this.store = initial
  }

  get primaryClient(): chrome.storage.StorageArea {
    return chrome.storage.local
  }

  get secondaryClient(): globalThis.Storage {
    throw new Error("Method not implemented.")
  }

  get area(): "sync" | "local" | "managed" | "session" {
    return "local"
  }

  get hasWebApi(): boolean {
    return false
  }

  get copiedKeySet(): Set<string> {
    return new Set()
  }

  isCopied: (key: string) => boolean = (key) => false

  get allCopied(): boolean {
    return false
  }

  getExtStorageApi: () => any = () => {
    throw new Error("Method not implemented.")
  }

  get hasExtensionApi(): boolean {
    return false
  }

  isWatchSupported: () => boolean = () => false

  protected keyNamespace: string = "mock"

  isValidKey: (nsKey: string) => boolean = (nsKey) => true

  getNamespacedKey: (key: string) => string = (key) => key

  getUnnamespacedKey: (nsKey: string) => string = (nsKey) => nsKey

  setCopiedKeySet(keyList: string[]): void {
    throw new Error("Method not implemented.")
  }

  rawGetAll: () => Promise<Record<string, string>> = async () => this.store

  getAll: () => Promise<Record<string, string>> = async () => this.store

  copy: (key?: string) => Promise<boolean> = async (key) => false

  protected rawGet: (key: string) => Promise<string | null | undefined> =
    async (key) => this.store[key]

  protected rawGetMany: (
    keys: string[]
  ) => Promise<Record<string, string | null | undefined>> = async (keys) => {
    const result: Record<string, string | null | undefined> = {}
    keys.forEach((key) => {
      result[key] = this.store[key]
    })
    return result
  }

  protected rawSet: (key: string, value: string) => Promise<null> = async (
    key,
    value
  ) => {
    this.store[key] = value
    return null
  }

  protected rawSetMany: (items: Record<string, string>) => Promise<null> =
    async (items) => {
      Object.entries(items).forEach(([key, value]) => {
        this.store[key] = value
      })
      return null
    }

  clear: (includeCopies?: boolean) => Promise<void> = async () => {
    this.store = {}
  }

  protected rawRemove: (key: string) => Promise<void> = async (key) => {
    delete this.store[key]
  }

  protected rawRemoveMany: (keys: string[]) => Promise<void> = async (keys) => {
    keys.forEach((key) => {
      delete this.store[key]
    })
  }

  removeAll: () => Promise<void> = async () => {
    this.store = {}
  }

  watch: (callbackMap: StorageCallbackMap) => boolean = (callbackMap) => false

  get: <T = string>(key: string) => Promise<T | undefined> = async (key) => {
    return this.store[key] as any
  }

  getMany: <T = any>(keys: string[]) => Promise<Record<string, T | undefined>> =
    async (keys) => {
      const result: Record<string, any> = {}
      keys.forEach((key) => {
        result[key] = this.store[key]
      })
      return result
    }

  set: (key: string, rawValue: any) => Promise<null> = async (
    key,
    rawValue
  ) => {
    this.store[key] = rawValue
    return null
  }

  setMany: (items: Record<string, any>) => Promise<null> = async (items) => {
    Object.entries(items).forEach(([key, value]) => {
      this.store[key] = value
    })
    return null
  }

  remove: (key: string) => Promise<void> = async (key) => {
    delete this.store[key]
  }

  removeMany: (keys: string[]) => Promise<void> = async (keys) => {
    keys.forEach((key) => {
      delete this.store[key]
    })
  }

  parseValue: <T>(rawValue: any) => Promise<T | undefined> = async (rawValue) =>
    rawValue

  getItem<T = string>(key: string): Promise<T | undefined> {
    return this.get(key)
  }

  getItems<T = string>(keys: string[]): Promise<Record<string, T | undefined>> {
    return this.getMany(keys)
  }

  setItem(key: string, rawValue: any): Promise<void> {
    return this.set(key, rawValue) as any
  }

  setItems(items: Record<string, any>): Promise<void> {
    return this.setMany(items) as any
  }

  removeItem(key: string): Promise<void> {
    return this.remove(key)
  }

  removeItems(keys: string[]): Promise<void> {
    return this.removeMany(keys)
  }

  async copyAll(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  setNamespace: (namespace: string) => void = (namespace) => {
    this.keyNamespace = namespace
  }

  protected async perseValue<T>(rawValue: any): Promise<T | undefined> {
    return rawValue
  }
}
