import type { Meta, StoryObj } from "@storybook/react";

import { Setting } from "./setting";
import { NotificationSetting } from "types/setting";
import { useState } from "react";

const meta = {
  component: Setting,
} satisfies Meta<typeof Setting>;

export default meta;

export const Default: StoryObj<typeof Setting> = {
  render: () => {
    const [notification, setNotification] = useState<NotificationSetting>({
      time: 10,
      unit: "hour",
      active: false,
    });

    return (
      <meta.component
        notification={{ ...notification, onChange: setNotification }}
        onClickBack={() => console.log(notification)}
      ></meta.component>
    );
  },
};
