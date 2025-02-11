import { Meta, StoryObj } from "@storybook/react"
import { CircleFlame } from "components/atoms/flames/circle"
import { Morou } from "components/atoms/images/morou"

const meta = {
  component: CircleFlame
} satisfies Meta<typeof CircleFlame>

export default meta

export const Default: StoryObj<typeof CircleFlame> = {
  args: {
    children: <Morou />
  }
}
