import type { Meta, StoryObj } from "@storybook/react";

import { XMarkButton } from "./x-mark";

const meta = {
  component: XMarkButton,
} satisfies Meta<typeof XMarkButton>;

export default meta;

export const Default: StoryObj<typeof XMarkButton> = {};
