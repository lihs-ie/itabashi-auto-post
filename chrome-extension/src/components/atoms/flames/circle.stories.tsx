import { Meta, StoryObj } from "@storybook/react";

import { CircleFlame } from "./circle";
import { Morou } from "../images/morou";

const meta = {
  component: CircleFlame,
} satisfies Meta<typeof CircleFlame>;

export default meta;

export const Default: StoryObj<typeof CircleFlame> = {
  args: {
    children: <Morou />,
  },
};
