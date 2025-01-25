import type { Meta, StoryObj } from "@storybook/react"
import { IntervalSelector } from "components/molecules/select/interval"
import { Interval } from "domains/setting/notification"
import { useState } from "react"
import { Builder } from "tests/factories/common"
import { IntervalFactory } from "tests/factories/domains/setting"

const meta = {
  component: IntervalSelector
} satisfies Meta<typeof IntervalSelector>

export default meta

export const Default: StoryObj<typeof IntervalSelector> = {
  render: () => {
    const [value, setValue] = useState<Interval>(
      Builder.get(IntervalFactory).build()
    )

    return <IntervalSelector value={value} onChange={setValue} />
  }
}
