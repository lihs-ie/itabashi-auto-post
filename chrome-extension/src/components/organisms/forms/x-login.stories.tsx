import type { Meta, StoryObj } from "@storybook/react";

import { XLoginForm } from "./x-login";

const meta = {
  component: XLoginForm,
} satisfies Meta<typeof XLoginForm>;

export default meta;

const onClick = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
};

export const Default: StoryObj<typeof XLoginForm> = {
  args: {
    onClick,
  },
};
