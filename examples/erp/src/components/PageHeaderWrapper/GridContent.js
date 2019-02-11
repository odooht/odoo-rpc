import React, { PureComponent } from 'react';
//import { connect } from 'dva';
import styles from './GridContent.less';

import { contentWidth } from '@/defaultSettings';


class GridContent extends PureComponent {
  render() {
    const { /* contentWidth, */ children } = this.props;
    let className = `${styles.main}`;
    if (contentWidth === 'Fixed') {
      className = `${styles.main} ${styles.wide}`;
    }
    return <div className={className}>{children}</div>;
  }
}

export default GridContent;

/*

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(GridContent);

*/
