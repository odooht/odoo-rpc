import React from 'react';
import styles from './index.css';
import odoo from '@/odoo/odoo';

class BasicLayout extends React.Component {
  state = ({
    sid: null
  })
  login = async () => {
    const data = await odoo.login({ login: 'admin', password: '123' });
    if (data) {
      this.setState({
        sid: data
      })
    }
  };
  componentDidMount() {
    this.login()
  }
  render() {
    const { sid } = this.state;
    return (
      sid ?
        <div className={styles.normal}>
          {this.props.children}
        </div> : <div>正在加载</div>
    );
  }
}

export default BasicLayout;
