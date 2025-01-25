import { chrome as setting } from "config/chrome"

type Identifier =
  (typeof setting.listener.identifier)[keyof typeof setting.listener.identifier]

export type Inner<T> = {
  identifier: Identifier
  payload?: Array<T>
}

export type Outer<T> = {
  success: boolean
  response: T
  error?: string
}

export const createListener = <T>(
  identifier: Identifier,
  callback: (...args: Array<T>) => Promise<void>
) => {
  chrome.runtime.onMessage.addListener((message: Inner<T>, _, sendResponse) => {
    if (message.identifier === identifier) {
      callback(...(message.payload || []))
        .then((response) => {
          sendResponse({ success: true, response })
        })
        .catch((error) => {
          console.error(error)
          sendResponse({ success: false, error: error.message })
        })

      return true
    }
  })
}

type Initializer<T> = {
  callback: (...args: any[]) => T
  args?: any[]
}

export const initiate = <Methods extends Array<Initializer<any>>>(
  ...methods: Methods
) => {
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      methods.forEach((method) => method.callback(...(method.args || [])))
    }
  })
}

export const sendMessage = async <I, O>(
  message: Inner<I>
): Promise<Outer<O>> => {
  return await chrome.runtime.sendMessage<Inner<I>, Outer<O>>(message)
}
