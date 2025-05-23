import { IconProp } from "@fortawesome/fontawesome-svg-core"
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// import styleText from "data-text:./arrow.module.scss"
// import type { PlasmoCSConfig } from "plasmo"

import styles from "./arrow.module.scss"

type Angle = "up" | "down" | "left" | "right"

// export const getStyle = () => {
//   const style = document.createElement("style")
//   style.textContent = styleText
//   return style
// }

const icon: { [key in Angle]: IconProp } = {
  up: faChevronUp,
  down: faChevronDown,
  left: faChevronLeft,
  right: faChevronRight
} as const

export type Props = {
  onClick: () => void
  angle: Angle
}

export const ArrowButton = (props: Props) => (
  <FontAwesomeIcon
    className={styles.container}
    icon={icon[props.angle]}
    onClick={props.onClick}
  />
)
