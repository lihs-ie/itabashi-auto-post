import { TimeSelector } from "components/molecules/select/time";
import styles from "./setting.module.scss";
import { XMarkButton } from "components/atoms/buttons/x-mark";
import { SimpleToggle } from "components/atoms/toggle/simple";
import { NotificationSetting } from "types/setting";

export type Props = {
  notification: NotificationSetting & { onChange: (value: NotificationSetting) => void };
  onClickBack: () => void;
};

export const Setting = (props: Props) => {
  console.log(props);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <XMarkButton onClick={props.onClickBack} />
      </div>
      <div className={styles.setting}>
        <div className={styles.label}>
          <SimpleToggle
            label="ログイン切れ通知"
            value={props.notification.active}
            onChange={(value) =>
              props.notification.onChange({ ...props.notification, active: value })
            }
          />
        </div>
        {props.notification.active && (
          <TimeSelector
            value={props.notification}
            onChange={(value) => props.notification.onChange({ ...props.notification, ...value })}
          />
        )}
      </div>
    </div>
  );
};
