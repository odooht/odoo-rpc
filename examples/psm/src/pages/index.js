import styles from './index.css';

export default function() {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>Welcome</li>
        <li>Project Schedule Management</li>
      </ul>
    </div>
  );
}

