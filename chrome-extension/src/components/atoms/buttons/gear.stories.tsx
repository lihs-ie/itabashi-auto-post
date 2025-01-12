import type { Meta, StoryObj } from "@storybook/react";

import { GearButton } from "./gear";

const meta = {
  component: GearButton,
} satisfies Meta<typeof GearButton>;

export default meta;

export const Default: StoryObj<typeof GearButton> = {};
