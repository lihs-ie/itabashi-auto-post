import type { Meta, StoryObj } from "@storybook/react"
import { PopUp } from "components/templates/popup"
import { Interval, Notification } from "domains/setting/notification"
import { List, Range } from "immutable"
import { useState } from "react"
import { Builder } from "tests/factories/common"
import { NotificationFactory } from "tests/factories/domains/setting"

const meta = {
  component: PopUp
} satisfies Meta<typeof PopUp>

export default meta

const createNotifications = (count: number): List<Notification> =>
  Range(0, count)
    .map(
      (index): Notification =>
        Builder.get(NotificationFactory).build({
          title: `Sample-${index + 1}`,
          active: true,
          interval:
            index % 2 === 0 ? null : new Interval(1 * (index + 1), "hour")
        })
    )
    .toList()

export const Default: StoryObj<typeof PopUp> = {
  render: () => {
    const [isLogin, setIsLogin] = useState(false)
    const [notifications, setNotifications] = useState(createNotifications(3))

    return (
      <meta.component
        header={{
          settings: {
            notification: {
              values: notifications,
              onChange: (values) => setNotifications(values)
            }
          }
        }}
        content={{
          isLogin: false,
          onClickLogin: () => Promise.resolve(setIsLogin(true)),
          onClickLogout: () => Promise.resolve(setIsLogin(false))
        }}></meta.component>
    )
  }
}
