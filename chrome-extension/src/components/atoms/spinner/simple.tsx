import styles from "./simple.module.scss"; // CSSファイルをインポート

export const SimpleSpinner = () => (
  <div className={styles.container}>
    <div className={styles.spinner}></div>
  </div>
);
