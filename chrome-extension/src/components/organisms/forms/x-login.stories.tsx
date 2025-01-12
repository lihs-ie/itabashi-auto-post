import type { Meta, StoryObj } from "@storybook/react";

import { XloginForm } from "./x-login";

const meta = {
  component: XloginForm,
} satisfies Meta<typeof XloginForm>;

export default meta;

export const Default: StoryObj<typeof XloginForm> = {};
