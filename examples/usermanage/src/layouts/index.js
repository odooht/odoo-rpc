import React from 'react';
import styles from './index.css';
import odoo from '@/odoo/odoo';

class BasicLayout extends React.Component {
  state = ({
    sid: null
  })
  componentDidMount() {
    this.login()
  }
  login = async () => {
    const data = await odoo.login({ login: "admin", password: "123" });
    if (data) {
      this.setState({
        sid: data
      })
    }
  };
  render() {
    const { sid } = this.state;
    return (
      sid ?
        <div className={styles.normal}>
          {this.props.children}
        </div> : <div>
          加载中
        </div>
    );
  }
}

export default BasicLayout;
