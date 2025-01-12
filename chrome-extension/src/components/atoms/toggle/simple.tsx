import styles from "./simple.module.scss";
import { Toggle } from "@gilbarbara/components";

export type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
};

export const SimpleToggle = (props: Props) => (
  <Toggle
    className={styles.container}
    label={props.label}
    accent={"green"}
    checked={props.value}
    onToggle={props.onChange}
  />
);
