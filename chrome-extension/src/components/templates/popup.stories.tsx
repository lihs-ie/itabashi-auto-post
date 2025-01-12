import type { Meta, StoryObj } from "@storybook/react";

import { PopUp } from "./popup";

const meta = {
  component: PopUp,
} satisfies Meta<typeof PopUp>;

export default meta;

const onClick = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
};

export const Default: StoryObj<typeof PopUp> = {
  args: {
    authenticate: onClick,
  },
};
