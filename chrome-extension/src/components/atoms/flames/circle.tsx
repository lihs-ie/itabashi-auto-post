import { ReactNode } from "react";
import styles from "./circle.module.scss";

export type Props = {
  children?: ReactNode;
};

export const CircleFlame = (props: Props) => (
  <div className={styles.container}>
    <div className={styles.children}>{props.children}</div>
  </div>
);
