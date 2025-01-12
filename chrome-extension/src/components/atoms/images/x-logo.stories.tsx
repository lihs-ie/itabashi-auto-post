import type { Meta, StoryObj } from "@storybook/react";

import { XLogo } from "./x-logo";

const meta = {
  component: XLogo,
} satisfies Meta<typeof XLogo>;

export default meta;

export const Default: StoryObj<typeof XLogo> = {};
