import type { Meta, StoryObj } from "@storybook/react";

import { SimpleToggle } from "./simple";
import { useState } from "react";

const meta = {
  component: SimpleToggle,
} satisfies Meta<typeof SimpleToggle>;

export default meta;

export const Default: StoryObj<typeof SimpleToggle> = {
  render: function Render() {
    const [checked, setChecked] = useState(false);

    return <SimpleToggle value={checked} onChange={setChecked} />;
  },
};
