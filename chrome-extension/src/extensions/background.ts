import { clear as clearBatch, createBatch, getAlarmTime, registerListener } from "aspects/alarms";
import { notify } from "aspects/notifications";
import { createListener, initiate } from "aspects/runtime";
import { onChange, get, set } from "aspects/storage";
import { authenticate, checkLogin, postTweet } from "aspects/x";
import { NotificationSetting } from "types/setting";

/**
 * Initialize
 */
initiate({ callback: authenticate }, { callback: checkLogin });

/**
 * Batch
 */
createBatch("checkLogin", 1);

registerListener((alarm) => {
  if (alarm.name === "checkLogin") {
    checkLogin();
  } else if (alarm.name === "notifyLogin") {
    notifyLogin();
  }
})

/**
 * Message Listener
 */
createListener("postTweet", postTweet);
createListener("startAuthFlow", authenticate);

/**
 * Notification
 */
const notifyLogin = async () => {
  const isLogin = await get<boolean|null>("isLogin");
  const settings = await get<NotificationSetting|null>('notificationSetting');

  if (!isLogin && settings?.active) {
    notify(
      "login",
      "basic", 
      "Xにログインしてください",
      "自動ポスト機能が制限されています。", 
      [{title: "Xにログイン"}],
      authenticate
    );
  }
}

(async() => {
  const notificationSetting = await get<NotificationSetting|null>("notificationSetting");

  if (!notificationSetting) {
    await set<NotificationSetting>("notificationSetting", { time: 15, unit: "minute", active: false});
  } else if (notificationSetting.active) {
    createBatch(
      "notifyLogin",
      getAlarmTime(notificationSetting?.unit ?? 'minute', notificationSetting?.time ?? 15),
    );
  }
})()

onChange<NotificationSetting>("notificationSetting", async (next) => {
  if (next.active) {
    await clearBatch('notifyLogin');
    createBatch("notifyLogin", getAlarmTime(next.unit, next.time));
  } else {
    await clearBatch('notifyLogin')
  }
});
