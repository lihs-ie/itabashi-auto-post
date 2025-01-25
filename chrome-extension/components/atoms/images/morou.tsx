import src from "data-base64:~assets/icon.png"

import styles from "./morou.module.scss"

export const Morou = () => (
  <img className={styles.container} src={src} alt="Morou" />
)
