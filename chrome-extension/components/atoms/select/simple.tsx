import React, { ReactNode } from "react"

import styles from "./simple.module.scss"

type Value = React.SelectHTMLAttributes<HTMLSelectElement>["value"]

export type Props<T extends Value> = {
  value?: T
  onChange: (value: T) => void
  candidates: Array<T>
  label?: ReactNode
}

export const SimpleSelect = <T extends Value>(props: Props<T>) => (
  <>
    <select
      className={styles.container}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as T)}>
      {props.candidates.map((candidate, index) => (
        <option key={index} value={candidate}>
          {candidate}
        </option>
      ))}
    </select>
  </>
)
