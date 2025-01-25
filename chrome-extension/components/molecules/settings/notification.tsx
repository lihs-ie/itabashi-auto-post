import { Toggle } from "components/atoms/input/toggle"
import { IntervalSelector } from "components/molecules/select/interval"
import { Notification } from "domains/setting/notification"

import styles from "./notification.module.scss"

export type Props = {
  value: Notification
  onChange: (value: Notification) => void
}

export const NotificationSetting = (props: Props) => (
  <div className={styles.container}>
    <div className={styles.label}>
      <Toggle
        label={props.value.title}
        value={props.value.active}
        onChange={(value) =>
          props.onChange(
            value ? props.value.activate() : props.value.deactivate()
          )
        }
      />
    </div>
    {props.value.active && props.value.interval && (
      <IntervalSelector
        value={props.value.interval}
        onChange={(value) =>
          props.onChange(
            new Notification(
              props.value.identifier,
              props.value.title,
              props.value.content,
              props.value.description,
              value,
              props.value.active,
              props.value.priority
            )
          )
        }
      />
    )}
  </div>
)
