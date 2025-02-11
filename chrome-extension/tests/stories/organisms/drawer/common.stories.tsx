import type { Meta, StoryObj } from "@storybook/react"
import { Drawer } from "components/organisms/drawer/common"
import { Setting } from "components/organisms/settings/common"
import { Interval, Notification } from "domains/setting/notification"
import { List, Range } from "immutable"
import { useState } from "react"
import { Builder } from "tests/factories/common"
import { NotificationFactory } from "tests/factories/domains/setting"

const meta = {
  component: Drawer
} satisfies Meta<typeof Drawer>

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

export const Default: StoryObj<typeof Drawer> = {
  args: {
    children: (
      <Setting
        notification={{ values: createNotifications(3), onChange: () => {} }}
      />
    )
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    return <meta.component {...args} />
  }
}
