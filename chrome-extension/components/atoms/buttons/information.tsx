import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "./information.module.scss"

export type Props = {
  onClick?: () => void
}

export const InformationButton = (props: Props) => (
  <FontAwesomeIcon
    className={styles.container}
    icon={faInfoCircle}
    onClick={props.onClick}
  />
)
