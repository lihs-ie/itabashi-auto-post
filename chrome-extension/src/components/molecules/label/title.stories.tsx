import type { Meta, StoryObj } from "@storybook/react";

import { Title } from "./title";

const meta = {
  component: Title,
} satisfies Meta<typeof Title>;

export default meta;

export const Default: StoryObj<typeof Title> = {};
