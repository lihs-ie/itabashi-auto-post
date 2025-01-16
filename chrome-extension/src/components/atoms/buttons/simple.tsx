import { ReactNode } from "react";
import styles from "./simple.module.scss";
import classNames from "classnames/bind";

type Appearance = "default" | "destructive";

export type Props = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  appearance?: Appearance;
};

const styleContext = classNames.bind(styles);

export const SimpleButton = (props: Props) => {
  const { appearance = "default" } = props;

  return (
    <button
      className={styleContext("container", appearance, {
        disabled: props.disabled,
      })}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
