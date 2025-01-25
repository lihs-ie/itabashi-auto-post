import { InformationButton } from "components/atoms/buttons/information"
import { CenterModal } from "components/molecules/modal/center"
import { NotificationSetting } from "components/molecules/settings/notification"
import { Notification } from "domains/setting/notification"
import { List } from "immutable"
import { Fragment, useState } from "react"

import styles from "./notifications.module.scss"

export type Props = {
  values: List<Notification>
  onChange: (value: List<Notification>) => void
}

export const Notifications = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>通知設定</label>
        <InformationButton onClick={() => setIsOpen(true)} />
        <CenterModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Explanation />
        </CenterModal>
      </div>
      {props.values.map((notification) => (
        <Fragment key={notification.identifier.value}>
          <NotificationSetting
            value={notification}
            onChange={(value) =>
              props.onChange(
                props.values.set(props.values.indexOf(value), value)
              )
            }
          />
          <hr className={styles.horizontal} />
        </Fragment>
      ))}
    </div>
  )
}

const Explanation = () => (
  <div>
    <h4 className={styles["explanation-title"]}>通知設定</h4>
    <p>通知を受け取るにはchromeの通知設定をONにしてください。</p>
    <a
      className={styles.link}
      target="_blank"
      href="https://support.microsoft.com/ja-jp/windows/-%E9%80%9A%E7%9F%A5-%E3%81%A8-%E3%82%AF%E3%82%A4%E3%83%83%E3%82%AF%E8%A8%AD%E5%AE%9A-%E3%82%92windows-ddcbbcd4-0a02-f6e4-fe14-6766d850f294#WindowsVersion=Windows_11">
      設定方法はこちら
    </a>
  </div>
)
