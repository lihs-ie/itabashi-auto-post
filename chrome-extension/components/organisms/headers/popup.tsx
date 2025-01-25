import { GearButton } from "components/atoms/buttons/gear"
import { useState } from "react"

import { Drawer } from "../drawer"
import { Setting, Props as SettingProps } from "../settings"
import styles from "./popup.module.scss"

export type Props = {
  settings: SettingProps
}

export const PopUpHeader = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.container}>
      <GearButton onClick={() => setIsOpen(true)} />
      <Drawer isOpen={isOpen} onClickBack={() => setIsOpen(false)}>
        <Setting {...props.settings} />
      </Drawer>
    </div>
  )
}
