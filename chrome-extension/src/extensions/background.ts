import { createBatch } from "aspects/alarms";
import { createListener, initiate } from "aspects/runtime";
import { checkLogin, postTweet } from "aspects/x";

// chrome.runtime.onInstalled.addListener((details) => {
//   if (details.reason === "install") {
//     checkLogin();
//   }
// });

// chrome.alarms.create("checkLogin", { periodInMinutes: 0.1 });

// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === "checkLogin") {
//     checkLogin();
//   }
// });

// chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
//   if (message.action === "postTweet") {
//     postTweet(message.tweet)
//       .then((response) => sendResponse({ success: true, response }))
//       .catch((error) => sendResponse({ success: false, error: error.message }));

//     return true;
//   }

//   sendResponse({ error: "Unknown action" });
//   return false;
// });

initiate({ callback: checkLogin });

createBatch("checkLogin", 0.1, checkLogin);

createListener("postTweet", postTweet);
