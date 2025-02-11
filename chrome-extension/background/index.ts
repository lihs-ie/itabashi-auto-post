import "reflect-metadata"

import {
  clear as clearBatch,
  createBatch,
  registerListener
} from "aspects/alarms"
import { createListener, initiate } from "aspects/runtime"
import { onChange } from "aspects/storage"
import { setting } from "config"
import {
  Interval,
  Notification,
  NotificationIdentifier,
  Priority
} from "domains/setting/notification"
import { container } from "providers"
import { Authentication, Message as MessageUseCase } from "use-cases"
import { Notification as NotificationUseCase } from "use-cases/notification"

const authUseCase = container.get(Authentication)
const notificationUseCase = container.get(NotificationUseCase)
const messageUseCase = container.get(MessageUseCase)

const login = async () => {
  try {
    const code = await authUseCase.issueCode()

    await authUseCase.login(code)

    await notificationUseCase.send(
      setting.notification.identifier.LOGIN_SUCCESS
    )
  } catch (error) {
    await notificationUseCase.send(
      setting.notification.identifier.LOGIN_FAILURE
    )
  }
}

const logout = async () => {
  try {
    await authUseCase.logout()

    await notificationUseCase.send(
      setting.notification.identifier.LOGOUT_SUCCESS
    )
  } catch (error) {
    await notificationUseCase.send(
      setting.notification.identifier.LOGOUT_FAILURE
    )
  }
}

const sendMessage = async (content: string) => {
  try {
    const payload = JSON.parse(content) as {
      identifier: string
      content: string
    }

    await messageUseCase.send(payload.identifier, payload.content)

    await notificationUseCase.send(
      setting.notification.identifier.SEND_MESSAGE_SUCCESS
    )
  } catch (error) {
    await notificationUseCase.send(
      setting.notification.identifier.SEND_MESSAGE_FAILURE
    )
  }
}

const initiateNotifications = async () => {
  const requireLogin = new Notification(
    new NotificationIdentifier(setting.notification.identifier.REQUIRE_LOGIN),
    "ログイン切れ通知",
    "Xにログインしてください",
    "自動ポスト機能が制限されています。Xにログインしてください。",
    new Interval(15, "minute"),
    true,
    Priority.HIGH
  )

  const loginSuccess = new Notification(
    new NotificationIdentifier(setting.notification.identifier.LOGIN_SUCCESS),
    'ログインに"成功"しました。',
    'ログインに"成功"しました。',
    "自動ポスト機能が有効になりました。",
    null,
    true,
    Priority.NORMAL
  )

  const loginFailure = new Notification(
    new NotificationIdentifier(setting.notification.identifier.LOGIN_FAILURE),
    'ログインに"失敗"しました。',
    'ログインに"失敗"しました。',
    "何度も失敗する場合は時間を置いてから再度ログインしてください。",
    null,
    true,
    Priority.NORMAL
  )

  const logoutSuccess = new Notification(
    new NotificationIdentifier(setting.notification.identifier.LOGOUT_SUCCESS),
    'ログアウトに"成功"しました。',
    'ログアウトに"成功"しました。',
    "自動ポストを有効にするには再度ログインしてください。",
    null,
    true,
    Priority.NORMAL
  )

  const logoutFailure = new Notification(
    new NotificationIdentifier(setting.notification.identifier.LOGOUT_FAILURE),
    'ログアウトに"失敗"しました。',
    "ログアウト",
    "何度も失敗する場合は時間を置いてから再度ログアウトしてください。",
    null,
    true,
    Priority.NORMAL
  )

  const sendMessageSuccess = new Notification(
    new NotificationIdentifier(
      setting.notification.identifier.SEND_MESSAGE_SUCCESS
    ),
    '自動ポストに"成功"しました。',
    '"成功"しました。',
    null,
    null,
    true,
    Priority.HIGH
  )

  const sendMessageFailure = new Notification(
    new NotificationIdentifier(
      setting.notification.identifier.SEND_MESSAGE_FAILURE
    ),
    '自動ポストに"失敗"しました。',
    '自動ポストに"失敗"しました。',
    "手動でポストしてください。",
    null,
    true,
    Priority.HIGH
  )

  await notificationUseCase.persist(requireLogin)
  await notificationUseCase.persist(loginSuccess)
  await notificationUseCase.persist(loginFailure)
  await notificationUseCase.persist(logoutSuccess)
  await notificationUseCase.persist(logoutFailure)
  await notificationUseCase.persist(sendMessageSuccess)
  await notificationUseCase.persist(sendMessageFailure)

  createBatch(requireLogin.identifier.value, requireLogin.interval.toMinutes())
}

/**
 * Initialize
 */
initiate({ callback: login }, { callback: initiateNotifications })

/**
 * Batch
 */
createBatch(setting.batch.identifier.CHECK_LOGIN, 1)

registerListener(async (alarm) => {
  const identifier = alarm.name

  if (identifier === setting.batch.identifier.CHECK_LOGIN) {
    try {
      await authUseCase.verify()
    } catch (error) {
      console.warn("Before login.")
    }
  } else if (identifier === setting.notification.identifier.REQUIRE_LOGIN) {
    const authentication = await chrome.storage.local.get("AUTHENTICATION")

    if (!authentication["AUTHENTICATION"]) {
      await notificationUseCase.send(identifier)
    }
  }
})

/**
 * Message Listener
 */
createListener("SEND_MESSAGE", sendMessage)
createListener("LOGIN", login)
createListener("LOGOUT", logout)

/**
 * Notifications
 */
onChange("NOTIFICATIONS", async () => {
  const notifications = await notificationUseCase.list()

  notifications.forEach(async (notification) => {
    if (notification.active && notification.interval) {
      await clearBatch(notification.identifier.value)
      createBatch(
        notification.identifier.value,
        notification.interval.toMinutes()
      )
    } else {
      await clearBatch(notification.identifier.value)
    }
  })
})
