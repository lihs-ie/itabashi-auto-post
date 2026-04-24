type ButtonOptions = NonNullable<
  chrome.notifications.NotificationOptions["buttons"]
>[number]

export const notify = (
  identifier: string,
  type: chrome.notifications.TemplateType = "basic" as chrome.notifications.TemplateType,
  title: string,
  message: string,
  buttons?: Array<ButtonOptions>,
  buttonCallback?: (notificationId: string, buttonIndex: number) => void
) => {
  chrome.notifications.create(identifier, {
    type,
    iconUrl: chrome.runtime.getURL("images/morou-icon.png"),
    title,
    message,
    priority: 2,
    buttons
  })

  chrome.notifications.onButtonClicked.addListener((notificationId) => {
    if (notificationId === identifier) {
      buttonCallback?.(notificationId, 0)
      chrome.notifications.clear(notificationId)
    }
  })
}
