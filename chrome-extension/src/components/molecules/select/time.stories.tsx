import type { Meta, StoryObj } from "@storybook/react";

import { TimeSelector } from "./time";

const meta = {
  component: TimeSelector,
} satisfies Meta<typeof TimeSelector>;

export default meta;

export const Default: StoryObj<typeof TimeSelector> = {
  args: {
    onChange: () => {},
  },
};
