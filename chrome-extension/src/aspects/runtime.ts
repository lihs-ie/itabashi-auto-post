type Action = "postTweet";

export type Message<T> = {
  action: Action;
  payload: Array<T>;
};

export const createListener = <T>(
  action: Action,
  callback: (...args: Array<T>) => Promise<void>
) => {
  chrome.runtime.onMessage.addListener((message: Message<T>, _, sendResponse) => {
    if (message.action === action) {
      callback(...message.payload)
        .then((response) => sendResponse({ success: true, response }))
        .catch((error) => sendResponse({ success: false, error: error.message }));

      return true;
    }

    sendResponse({ error: "Unknown action" });
    return false;
  });
};

type Initializer<T> = {
  callback: (...args: any[]) => T;
  args?: any[];
};

export const initiate = <Methods extends Array<Initializer<any>>>(...methods: Methods) => {
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      methods.forEach((method) => method.callback(...(method.args || [])));
    }
  });
};
