import odoo from '@/odoo'

import React from 'react';
import { Modal, Button, Form, Input } from 'antd';
const FormItem = Form.Item;



class List extends React.Component {
  state = {
      visible: false,
      id: null,
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = () => {
    const { form: { validateFields } } = this.props;

    validateFields( async  (err, values) => {
      if (!err) {
        if( ! values.login ){
          values.login = 'admin'
          values.password = '123'
        }

        const sid = await odoo.login(values)
        console.log(sid)
        console.log(odoo)

        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
      }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { visible } = this.state;

    return (
      <div>
        <Button onClick={this.showModal}>登录</Button>
        <Modal title="登录"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="用户名">
              {getFieldDecorator('login', {
                /*  rules: [{ required: true }], */
                initialValue: 'admin@t13',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="密码">
              {getFieldDecorator('password', {
                /*  rules: [{ required: true }], */
                initialValue: '123',
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(List);


/*
import styles from './index.css';

export default function() {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li><a href="https://umijs.org/guide/getting-started.html">Getting Started</a></li>
      </ul>
    </div>
  );
}
*/

