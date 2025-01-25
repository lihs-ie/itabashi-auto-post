export const createBatch = (identifier: string, periodInMinutes: number) => {
  chrome.alarms.get(identifier, (alarm) => {
    if (alarm) {
      chrome.alarms.clear(identifier)
    }
    chrome.alarms.create(identifier, { periodInMinutes })
  })
}

export const registerListener = (
  listener: (alarm: chrome.alarms.Alarm) => void
): void => {
  if (!chrome.alarms.onAlarm.hasListener(listener)) {
    chrome.alarms.onAlarm.addListener(listener)
  }
}

export const clear = async (identifier: string) => {
  await chrome.alarms.clear(identifier)
}
