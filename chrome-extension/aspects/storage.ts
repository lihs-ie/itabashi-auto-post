export const set = async <T>(key: string, value: T) =>
  await chrome.storage.local.set({ [key]: value })

export const get = async <T>(key: string): Promise<T> => {
  const value = await chrome.storage.local.get(key)

  return value[key]
}

export const remove = async (key: string) =>
  await chrome.storage.local.remove(key)

export const clear = async () => await chrome.storage.local.clear()

export const onChange = <T>(
  target: string,
  callback: (...args: Array<T>) => unknown
) => {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[target]) {
      callback(changes[target].newValue, changes[target].oldValue)
    }
  })
}

export type NotificationSetting = {
  time: number
  unit: "second" | "minute" | "hour"
}
