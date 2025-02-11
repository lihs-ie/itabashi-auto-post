import type { Meta, StoryObj } from "@storybook/react"
import { ArrowButton } from "components/atoms/buttons/arrow"

const meta = {
  component: ArrowButton
} satisfies Meta<typeof ArrowButton>

export default meta

export const Default: StoryObj<typeof ArrowButton> = {
  args: {
    onClick: () => {},
    angle: "up"
  }
}
