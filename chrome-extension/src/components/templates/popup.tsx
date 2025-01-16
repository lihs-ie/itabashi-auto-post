import { XLoginForm, Props as ContentProps } from "components/organisms/forms/x-login";
import styles from "./popup.module.scss";
import { PopUpHeader, Props as HeaderProps } from "components/organisms/headers/popup";

export type Props = {
  content: ContentProps;
  header: HeaderProps;
};

export const PopUp = (props: Props) => (
  <div className={styles.container}>
    <PopUpHeader {...props.header} />
    <XLoginForm {...props.content} />
  </div>
);
