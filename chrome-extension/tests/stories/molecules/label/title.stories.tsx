import type { Meta, StoryObj } from "@storybook/react"
import { Title } from "components/molecules/label/title"

const meta = {
  component: Title
} satisfies Meta<typeof Title>

export default meta

export const Default: StoryObj<typeof Title> = {}
