import type { Meta, StoryObj } from "@storybook/react"
import { Morou } from "components/atoms/images/morou"

const meta = {
  component: Morou
} satisfies Meta<typeof Morou>

export default meta

export const Default: StoryObj<typeof Morou> = {}
