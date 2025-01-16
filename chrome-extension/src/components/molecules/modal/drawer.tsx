import { useLayoutEffect, useRef } from "react";
import { ReactNode } from "react";
import styles from "./drawer.module.scss";
import gsap from "gsap";

export type Props = {
  children: ReactNode;
  isOpen: boolean;
};

export const Drawer = (props: Props) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;

    if (!drawer || !overlay) return;

    if (props.isOpen) {
      gsap.to(drawer, { x: 0, duration: 0.5, ease: "power3.out", visibility: "visible" });
      gsap.to(overlay, { opacity: 1, duration: 0.5, ease: "power3.out", pointerEvents: "auto" });
    } else {
      gsap.to(drawer, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          drawer.style.visibility = "hidden";
        },
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        pointerEvents: "none",
        onComplete: () => {
          overlay.style.visibility = "hidden";
        },
      });
    }
  }, [props.isOpen]);

  if (!props.isOpen) {
    return null;
  }

  return (
    <>
      <div ref={overlayRef} className={styles.overlay} />
      <div ref={drawerRef} className={styles.drawer}>
        {props.children}
      </div>
    </>
  );
};
