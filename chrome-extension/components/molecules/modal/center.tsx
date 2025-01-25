import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"

import styles from "./center.module.scss"

export type Props = {
  children: ReactNode
  isOpen?: boolean
  onClose?: () => void
}

export const CenterModal = (props: Props) => (
  <AnimatePresence>
    {props.isOpen && (
      <>
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => props.onClose?.()}
        />

        <motion.div
          className={styles.modal}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}>
          <button className={styles.close} onClick={() => props.onClose?.()}>
            ✕
          </button>
          {props.children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
)
