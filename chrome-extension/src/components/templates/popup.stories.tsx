import type { Meta, StoryObj } from "@storybook/react";

import { PopUp } from "./popup";

const meta = {
  component: PopUp,
} satisfies Meta<typeof PopUp>;

export default meta;

export const Default: StoryObj<typeof PopUp> = {};
