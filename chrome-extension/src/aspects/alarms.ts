type BatchType = "checkLogin";

export const createBatch = <T>(
  type: BatchType,
  periodInMinutes: number,
  callback: (...args: Array<any>) => T
) => {
  chrome.alarms.create(type, { periodInMinutes });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === type) {
      callback();
    }
  });
};
