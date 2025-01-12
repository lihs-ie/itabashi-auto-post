import { XLoginForm } from "components/organisms/forms/x-login";
import styles from "./popup.module.scss";

export type Props = {
  authenticate: () => Promise<void>;
  isLogin: boolean;
};

export const PopUp = (props: Props) => (
  <div className={styles.container}>
    <XLoginForm onClick={props.authenticate} isLogin={props.isLogin} />
  </div>
);
