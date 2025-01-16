import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./x-mark.module.scss";

export type Props = {
  onClick?: () => void;
};

export const XMarkButton = (props: Props) => (
  <FontAwesomeIcon className={styles.container} icon={faXmark} onClick={props.onClick} />
);
