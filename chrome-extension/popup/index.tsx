import { PopUp } from "components/templates/popup"
import { Notification } from "domains/setting/notification"
import { List } from "immutable"
import { container } from "providers"
import { useEffect, useState } from "react"
import { Notification as NotificationUseCase } from "use-cases"

import "reflect-metadata"

import { sendMessage } from "aspects/runtime"
import { setting } from "config"

const notificationUseCase = container.get(NotificationUseCase)

const createCheckLoginTimer = (callback: (isLogin: boolean) => void) => {
  const interval = setInterval(async () => {
    const authentication = await chrome.storage.local.get("AUTHENTICATION")
    callback(!!authentication["AUTHENTICATION"])
  }, 500)

  return interval
}

const Index = () => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null)
  const [notifications, setNotifications] = useState<List<Notification>>(List())
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifications = List.of(
          await notificationUseCase.find(
            setting.notification.identifier.REQUIRE_LOGIN
          )
        )
        setNotifications(notifications)

        const authentication = await chrome.storage.local.get("AUTHENTICATION")
        setIsLogin(!!authentication["AUTHENTICATION"])
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const interval = createCheckLoginTimer(setIsLogin)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const persistNotifications = async () => {
      for (const notification of notifications) {
        await notificationUseCase.persist(notification)
      }
    }
    persistNotifications()
  }, [notifications])

  return (
    <PopUp
      loading={loading}
      header={{
        settings: {
          notification: {
            values: notifications,
            onChange: (values) => setNotifications(values)
          }
        }
      }}
      content={{
        isLogin: isLogin ?? false,
        onClickLogin: () => sendMessage({ identifier: "LOGIN" }),
        onClickLogout: () => sendMessage({ identifier: "LOGOUT" })
      }}
    />
  )
}

export default Index
