import { sendMessage } from "aspects/runtime";
import { get, set } from "aspects/storage";
import { PopUp } from "components/templates/popup";
import { useEffect, useState } from "react";
import { NotificationSetting } from "types/setting";

const initial = await get<boolean | null>("isLogin");

const onClick = async () => {
  const response = await sendMessage({ action: "startAuthFlow" });

  if (!response.success) {
    console.log(response.error);
  } else {
    console.log("Authenticated successfully.");
  }
};

const initialNotificationSetting = await get<NotificationSetting>("notificationSetting");

export const Page = () => {
  const [isLogin, setIsLogin] = useState<boolean>(initial === null ? false : initial);
  const [notificationSetting, setNotificationSetting] = useState<NotificationSetting>(
    initialNotificationSetting
  );

  const onChangeNotificationSetting = async (value: NotificationSetting) => {
    setNotificationSetting(value);
    await set("notificationSetting", value);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const isLogin = await get<boolean | null>("isLogin");
      setIsLogin(isLogin === null ? false : isLogin);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PopUp
        content={{
          isLogin: isLogin,
          onClick,
        }}
        header={{
          settings: {
            notification: {
              ...notificationSetting,
              onChange: onChangeNotificationSetting,
            },
          },
        }}
      />
    </>
  );
};
