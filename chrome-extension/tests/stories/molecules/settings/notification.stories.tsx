import type { Meta, StoryObj } from "@storybook/react"
import { NotificationSetting } from "components/molecules/settings/notification"
import { Notification } from "domains/setting/notification"
import { useState } from "react"
import { Builder } from "tests/factories/common"
import { NotificationFactory } from "tests/factories/domains/setting"

const meta = {
  component: NotificationSetting
} satisfies Meta<typeof NotificationSetting>

export default meta

export const Default: StoryObj<typeof NotificationSetting> = {
  render: () => {
    const [value, setValue] = useState<Notification>(
      Builder.get(NotificationFactory).build({ title: "Sample Notification" })
    )

    return <meta.component value={value} onChange={setValue} />
  }
}
