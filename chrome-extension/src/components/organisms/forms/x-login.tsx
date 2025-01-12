import styles from "./x-login.module.scss";
import { SimpleButton } from "components/atoms/buttons/simple";
import { SimpleSpinner } from "components/atoms/spinner/simple";
import { Title } from "components/molecules/label/title";
import { useState } from "react";

export type Props = {
  onClick: () => Promise<void>;
  isLogin: boolean;
};

export const XLoginForm = (props: Props) => {
  const { isLogin = false } = props;
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      await props.onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Title />
      <SimpleButton disabled={isLogin} onClick={onClick}>
        {loading ? <SimpleSpinner /> : isLogin ? "ログイン済み" : "Xにログイン"}
      </SimpleButton>
    </div>
  );
};
