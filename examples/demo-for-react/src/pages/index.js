import styles from './index.css';
import odoo from '@/odoo/odoo'
import {Link} from 'dva/router';


export default function() {
  console.log(odoo)
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
      <Link to ="/Contact/Contact">ccctct</Link>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li><a href="https://umijs.org/guide/getting-started.html">Getting Started</a></li>
      </ul>
    </div>
  );
}
