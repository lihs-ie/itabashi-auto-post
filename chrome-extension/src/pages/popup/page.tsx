import { sendMessage } from "aspects/runtime";
import { get } from "aspects/storage";
import { PopUp } from "components/templates/popup";
import { useEffect, useState } from "react";

const initial = await get<boolean | null>("isLogin");

const onClick = async () => {
  const response = await sendMessage({ action: "startAuthFlow" });

  if (!response.success) {
    console.log(response.error);
  } else {
    console.log("Authenticated successfully.");
  }
};

export const Page = () => {
  const [isLogin, setIsLogin] = useState(initial);

  useEffect(() => {
    const interval = setInterval(async () => {
      const isLogin = await get<boolean | null>("isLogin");
      setIsLogin(isLogin);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PopUp authenticate={onClick} isLogin={isLogin === null ? false : isLogin} />
    </>
  );
};
