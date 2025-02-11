import type { Meta, StoryObj } from "@storybook/react"
import { SimpleSpinner } from "components/atoms/spinner/simple"

const meta = {
  component: SimpleSpinner
} satisfies Meta<typeof SimpleSpinner>

export default meta

export const Default: StoryObj<typeof SimpleSpinner> = {}
