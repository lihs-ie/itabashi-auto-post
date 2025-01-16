import type { Meta, StoryObj } from "@storybook/react";

import { Drawer } from "./drawer";
import { Setting } from "../settings/setting";
import { useState } from "react";

const meta = {
  component: Drawer,
} satisfies Meta<typeof Drawer>;

export default meta;

export const Default: StoryObj<typeof Drawer> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Drawer isOpen={isOpen}>
        <Setting
          notification={{
            time: 15,
            unit: "minute",
            active: true,
            onChange: (value) => console.log(value),
          }}
          onClickBack={() => setIsOpen(false)}
        />
      </Drawer>
    );
  },
};
