import { SimpleSelect } from "components/atoms/select/simple"
import { Interval, TimeUnit } from "domains/setting/notification"
import { List, Map } from "immutable"
import { useState } from "react"

import styles from "./interval.module.scss"

export type Props = {
  value?: Interval
  onChange: (value: Interval) => void
}

const times = Map<TimeUnit, List<number>>({
  second: List<number>([10, 15, 30, 45]),
  minute: List<number>(
    Array.from({ length: 11 }, (_, index) => (index + 1) * 5)
  ),
  hour: List<number>(Array.from({ length: 24 }, (_, index) => index + 1))
})

const units = Map<TimeUnit, string>({
  second: "秒",
  minute: "分",
  hour: "時間"
})

export const IntervalSelector = (props: Props) => {
  const [time, setTime] = useState<number>(props.value?.time || 10)
  const [unit, setUnit] = useState<TimeUnit>(props.value?.unit || "second")

  const handleUnitChange = (candidate: string) => {
    const nextUnit = units.keyOf(candidate as string)!
    const defaultTime = times.get(nextUnit)!.first()!

    setUnit(nextUnit)
    setTime(defaultTime)

    props.onChange(new Interval(defaultTime, nextUnit))
  }

  const handleTimeChange = (candidate: number) => {
    const nextTime = Number(candidate)

    setTime(nextTime)

    props.onChange(new Interval(nextTime, unit))
  }

  return (
    <div className={styles.container}>
      <SimpleSelect
        value={time}
        onChange={handleTimeChange}
        candidates={times.get(unit)!.toArray()}
      />
      <SimpleSelect
        value={units.get(unit)!}
        onChange={handleUnitChange}
        candidates={units.toList().toArray()}
      />
      <span>ごとに通知する</span>
    </div>
  )
}
