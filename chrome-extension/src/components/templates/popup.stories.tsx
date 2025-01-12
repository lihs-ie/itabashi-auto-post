import type { Meta, StoryObj } from "@storybook/react";

import { PopUp } from "./popup";
import { useState } from "react";
import { NotificationSetting } from "types/setting";

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

const onChangeNotificationSetting = (value: NotificationSetting) => {
  console.log(value);
};

export const Default: StoryObj<typeof PopUp> = {
  args: {
    content: {
      isLogin: false,
      onClick,
    },
    header: {
      settings: {
        notification: {
          value: { time: 10, unit: "minute" },
          onChange: onChangeNotificationSetting,
        },
      },
    },
  },
  render: () => {
    const [notification, setNotification] = useState<NotificationSetting>({
      time: 10,
      unit: "hour",
      active: false,
    });

    return (
      <PopUp
        header={{
          settings: {
            notification: { ...notification, onChange: setNotification },
          },
        }}
        content={{
          isLogin: true,
          onClick: () => Promise.resolve(console.log("authenticate")),
        }}
      />
    );
  },
};
