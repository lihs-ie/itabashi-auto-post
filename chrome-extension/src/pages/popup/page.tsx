import { get } from "aspects/storage";
import { authenticate } from "aspects/x";
import { PopUp } from "components/templates/popup";
import { Suspense, useEffect, useState } from "react";

const initial = await get<boolean | null>("isLogin");

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
      <PopUp onClick={authenticate} isLogin={isLogin === null ? false : isLogin} />
      <Suspense fallback={<div>ログイン中...</div>} />
    </>
  );
};
