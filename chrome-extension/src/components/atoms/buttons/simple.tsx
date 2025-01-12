import { ReactNode } from "react";
import styles from "./simple.module.scss";

export type Props = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const SimpleButton = (props: Props) => (
  <button
    className={`${styles.container} ${props.disabled && styles.disabled}`}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.children}
  </button>
);
