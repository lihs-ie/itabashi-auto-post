import { CircleFlame } from "components/atoms/flames/circle";
import styles from "./title.module.scss";
import { Morou } from "components/atoms/images/morou";

export const Title = () => (
  <div className={styles.container}>
    <div className={styles.icon}>
      <CircleFlame>
        <Morou />
      </CircleFlame>
    </div>
    <span className={styles.subtitle}>Itabashi auto post</span>
  </div>
);
