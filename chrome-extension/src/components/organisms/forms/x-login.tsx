import styles from "./x-login.module.scss";
import { SimpleButton } from "components/atoms/buttons/simple";
import { Title } from "components/molecules/label/title";

export type Props = {
  onClick?: () => void;
  isLogin: boolean;
};

export const XloginForm = (props: Props) => {
  const { isLogin = false } = props;

  return (
    <div className={styles.container}>
      <Title />
      <SimpleButton disabled={isLogin} onClick={props.onClick}>
        {props.isLogin ? "ログイン済み" : "Xにログイン"}
      </SimpleButton>
    </div>
  );
};
