import type { Meta, StoryObj } from "@storybook/react";

import { SimpleButton } from "./simple";

const meta = {
  component: SimpleButton,
} satisfies Meta<typeof SimpleButton>;

export default meta;

export const Default: StoryObj<typeof SimpleButton> = {
  args: {
    children: "Click me!",
  },
};
