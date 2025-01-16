import type { Meta, StoryObj } from "@storybook/react";

import { PopUpHeader } from "./popup";

const meta = {
  component: PopUpHeader,
} satisfies Meta<typeof PopUpHeader>;

export default meta;

export const Default: StoryObj<typeof PopUpHeader> = {
  args: {
    settings: {
      notification: {
        value: { time: 10, unit: "minute" },
      },
    },
  },
};
