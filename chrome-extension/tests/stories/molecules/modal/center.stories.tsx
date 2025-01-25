import type { Meta, StoryObj } from "@storybook/react"
import { CenterModal } from "components/molecules/modal/center"

const meta = {
  component: CenterModal
} satisfies Meta<typeof CenterModal>

export default meta

export const Default: StoryObj<typeof CenterModal> = {}
