type BatchType = "checkLogin" | "notifyLogin";

export const createBatch = (
  type: BatchType,
  periodInMinutes: number,
) => {
  chrome.alarms.get(type, (alarm) => {
    if (alarm) {
      chrome.alarms.clear(type);
    }
    chrome.alarms.create(type, { periodInMinutes });
  });
};

export const registerListener = (listener: (alarm: chrome.alarms.Alarm) => void): void => {
  if (!chrome.alarms.onAlarm.hasListener(listener)) {
    chrome.alarms.onAlarm.addListener(listener);
  }
}

export const clear = async (type: BatchType) => {
  await chrome.alarms.clear(type)
};

export const getAlarmTime = (unit: "second" | "minute" | "hour", time: number) => {
  switch (unit) {
    case "second":
      return time / 60;
    case "minute":
      return time;
    case "hour":
      return time * 60;
  }
}
