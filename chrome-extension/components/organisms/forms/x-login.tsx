import { Outer } from "aspects/runtime"
import { SimpleButton } from "components/atoms/buttons/simple"
import { SimpleSpinner } from "components/atoms/spinner/simple"
import { Title } from "components/molecules/label/title"
import { useState } from "react"

import styles from "./x-login.module.scss"

export type Props = {
  isLogin: boolean
  onClickLogin: () => Promise<Outer<unknown>>
  onClickLogout: () => Promise<Outer<unknown>>
}

export const XLoginForm = (props: Props) => {
  const { isLogin = false } = props
  const [loading, setLoading] = useState(false)

  const onClickLogin = async () => {
    try {
      setLoading(true)
      const _ = await props.onClickLogin()
      return
    } finally {
      setLoading(false)
    }
  }

  const onClickLogout = async () => {
    try {
      setLoading(true)
      const _ = await props.onClickLogout()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Title />
      <div className={styles.buttons}>
        {loading ? (
          <SimpleSpinner />
        ) : (
          <>
            <SimpleButton disabled={isLogin} onClick={onClickLogin}>
              {isLogin ? "ログイン済み" : "Xにログイン"}
            </SimpleButton>
            {isLogin && (
              <SimpleButton
                appearance="destructive"
                disabled={!isLogin}
                onClick={onClickLogout}>
                ログアウト
              </SimpleButton>
            )}
          </>
        )}
      </div>
    </div>
  )
}
