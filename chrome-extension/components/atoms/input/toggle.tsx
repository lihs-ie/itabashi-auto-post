import classNames from "classnames/bind"
import { ReactNode } from "react"

import styles from "./toggle.module.scss"

const styleContext = classNames.bind(styles)

export type Props = {
  value?: boolean
  onChange: (value: boolean) => void
  label?: ReactNode
}

export const Toggle = (props: Props) => {
  return (
    <div className={styleContext("container")}>
      {props.label && (
        <label htmlFor="toggle" className={styleContext("text-label")}>
          {props.label}
        </label>
      )}
      <div className={styleContext("toggle")}>
        <input
          checked={props.value}
          onChange={() => props.onChange(!props.value)}
          className={styleContext("input")}
          id="toggle"
          type="checkbox"
        />
        <label
          className={styleContext("label", { checked: props.value })}
          htmlFor="toggle">
          <span className={styleContext("button")} />
        </label>
      </div>
    </div>
  )
}
