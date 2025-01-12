import { XloginForm } from "components/organisms/forms/x-login";
import styles from "./popup.module.scss";

export type Props = {
  onClick?: () => void;
  isLogin: boolean;
};

export const PopUp = (props: Props) => (
  <div className={styles.container}>
    <XloginForm onClick={props.onClick} isLogin={props.isLogin} />
  </div>
);
