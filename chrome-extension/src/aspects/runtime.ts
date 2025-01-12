type Action = "postTweet" | "startAuthFlow";

export type Inner<T> = {
  action: Action;
  payload?: Array<T>;
};

export type Outer<T> = {
  success: boolean;
  response: T;
  error?: string;
};

export const createListener = <T>(
  action: Action,
  callback: (...args: Array<T>) => Promise<void>
) => {
  chrome.runtime.onMessage.addListener((message: Inner<T>, _, sendResponse) => {
    if (message.action === action) {
      callback(...(message.payload || []))
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

export const sendMessage = async <I, O>(message: Inner<I>): Promise<Outer<O>> => {
  return await chrome.runtime.sendMessage<Inner<I>, Outer<O>>(message);
};
