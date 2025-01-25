import { ArrowButton } from "components/atoms/buttons/arrow"
import gsap from "gsap"
import { ReactNode, useEffect, useRef, useState } from "react"

import styles from "./common.module.scss"

export type Props = {
  children: ReactNode
  isOpen: boolean
  onClickBack: () => void
}

export const Drawer = (props: Props) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const drawer = drawerRef.current
    const overlay = overlayRef.current

    if (!drawer || !overlay) return

    if (props.isOpen) {
      setIsAnimating(true)
      gsap.to(drawer, {
        x: 0,
        duration: 0.5,
        ease: "power3.out",
        visibility: "visible"
      })
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        pointerEvents: "auto"
      })
    } else {
      gsap.to(drawer, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          setIsAnimating(false)
        }
      })
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        pointerEvents: "none"
      })
    }
  }, [props.isOpen])

  return (
    <>
      <div
        ref={overlayRef}
        className={styles.overlay}
        style={{ display: isAnimating || props.isOpen ? "block" : "none" }}
      />
      <div
        ref={drawerRef}
        className={styles.drawer}
        style={{
          display: isAnimating || props.isOpen ? "block" : "none",
          visibility: isAnimating || props.isOpen ? "visible" : "hidden"
        }}>
        <div className={styles.content}>
          <div className={styles.back}>
            <ArrowButton angle="left" onClick={props.onClickBack} />
          </div>
          {props.children}
        </div>
      </div>
    </>
  )
}
