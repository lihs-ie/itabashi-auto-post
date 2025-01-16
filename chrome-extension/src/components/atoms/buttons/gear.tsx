import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./gear.module.scss";

export type Props = {
  onClick?: () => void;
};

export const GearButton = (props: Props) => (
  <FontAwesomeIcon className={styles.container} icon={faGear} onClick={props.onClick} />
);
