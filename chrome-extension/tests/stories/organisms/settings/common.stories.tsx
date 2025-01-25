import type { Meta, StoryObj } from "@storybook/react"
import { Setting } from "components/organisms/settings/common"
import { Interval, Notification } from "domains/setting/notification"
import { List, Range } from "immutable"
import { useState } from "react"
import { Builder } from "tests/factories/common"
import { NotificationFactory } from "tests/factories/domains/setting"

const meta = {
  component: Setting
} satisfies Meta<typeof Setting>

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

export const Default: StoryObj<typeof Setting> = {
  render: () => {
    const [notifications, setNotifications] = useState(createNotifications(3))

    return (
      <meta.component
        notification={{
          values: notifications,
          onChange: setNotifications
        }}
      />
    )
  }
}
