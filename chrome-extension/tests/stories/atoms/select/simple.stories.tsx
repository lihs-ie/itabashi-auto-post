import type { Meta, StoryObj } from "@storybook/react"
import { SimpleSelect } from "components/atoms/select/simple"
import { Range } from "immutable"

const meta = {
  component: SimpleSelect
} satisfies Meta<typeof SimpleSelect>

export default meta

export const Default: StoryObj<typeof SimpleSelect> = {
  args: {
    candidates: Range(0, 10)
      .map((index) => `option-${index}`)
      .toArray()
  }
}
