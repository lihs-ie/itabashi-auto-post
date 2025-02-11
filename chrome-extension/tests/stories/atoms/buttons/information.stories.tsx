import type { Meta, StoryObj } from "@storybook/react"
import { InformationButton } from "components/atoms/buttons/information"

const meta = {
  component: InformationButton
} satisfies Meta<typeof InformationButton>

export default meta

export const Default: StoryObj<typeof InformationButton> = {}
