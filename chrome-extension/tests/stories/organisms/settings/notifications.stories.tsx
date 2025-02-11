import type { Meta, StoryObj } from "@storybook/react"
import { Notifications } from "components/organisms/settings/notifications"
import { Interval } from "domains/setting/notification"
import { Range } from "immutable"
import { useState } from "react"
import { Builder } from "tests/factories/common"
import { NotificationFactory } from "tests/factories/domains/setting"

const meta = {
  component: Notifications
} satisfies Meta<typeof Notifications>

export default meta

const notifications = Range(0, 5)
  .map((index) =>
    Builder.get(NotificationFactory).build({
      title: `Sample-${index + 1}`,
      active: true,
      interval: index % 2 === 0 ? null : new Interval(1 * (index + 1), "hour")
    })
  )
  .toList()

export const Default: StoryObj<typeof Notifications> = {
  render: () => {
    const [values, setValues] = useState(notifications)

    return <meta.component values={values} onChange={setValues} />
  }
}
