export const set = async <T>(key: string, value: T) =>
  await chrome.storage.local.set({ [key]: value });

export const get = async <T>(key: string): Promise<T> => {
  const value = await chrome.storage.local.get(key);

  return value[key];
};

export const remove = async (key: string) => await chrome.storage.local.remove(key);
