import type { Meta, StoryObj } from "@storybook/react"
import { Toggle } from "components/atoms/input/toggle"
import { useState } from "react"

const meta = {
  component: Toggle
} satisfies Meta<typeof Toggle>

export default meta

export const Default: StoryObj<typeof Toggle> = {
  render: () => {
    const [value, setValue] = useState(false)
    return <meta.component value={value} onChange={setValue} label="Sample" />
  }
}
