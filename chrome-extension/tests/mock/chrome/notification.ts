import { expect } from "vitest"

export const createMock = (
  identifier: string,
  options: chrome.notifications.NotificationOptions
) => {
  return (
    innerIdentifier: string,
    innerOptions: chrome.notifications.NotificationOptions
  ) => {
    expect(innerIdentifier).toBe(identifier)
    expect(innerOptions).toEqual(options)
  }
}
