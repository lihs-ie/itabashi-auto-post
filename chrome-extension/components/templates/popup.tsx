import { SimpleSpinner } from "components/atoms/spinner/simple"
import {
  Props as ContentProps,
  XLoginForm
} from "components/organisms/forms/x-login"
import {
  Props as HeaderProps,
  PopUpHeader
} from "components/organisms/headers/popup"

import styles from "./popup.module.scss"

export type Props = {
  header: HeaderProps
  content: ContentProps
  loading?: boolean
}

export const PopUp = (props: Props) => (
  <>
    {props.loading ? (
      <div className={styles.loading}>
        <SimpleSpinner />
      </div>
    ) : (
      <div className={styles.container}>
        <PopUpHeader {...props.header} />
        <XLoginForm {...props.content} />
      </div>
    )}
  </>
)
