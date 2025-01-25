import styles from "./common.module.scss"
import { Notifications, Props as NotificationsProps } from "./notifications"

export type Props = {
  notification: NotificationsProps
}

export const Setting = (props: Props) => (
  <div className={styles.container}>
    <Notifications {...props.notification} />
  </div>
)
