import styles from "./popup.module.scss";

import { GearButton } from "components/atoms/buttons/gear";
import { Drawer } from "components/molecules/modal/drawer";
import { Props as SettingProps, Setting } from "components/molecules/settings/setting";
import { useState } from "react";

export type Props = {
  settings: Omit<SettingProps, "onClickBack">;
};

export const PopUpHeader = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <GearButton onClick={() => setIsOpen(true)} />
      <Drawer isOpen={isOpen}>
        <Setting {...props.settings} onClickBack={() => setIsOpen(false)} />
      </Drawer>
    </div>
  );
};
