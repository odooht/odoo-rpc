import odoo from '@/odoo'

import React from 'react';
import { Modal, Button, Form, Input } from 'antd';

//import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormItemLayout from '@/layouts/FormItemLayout';

const FormItem = Form.Item;

class List extends React.Component {
  state = {
      visible: false,
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
    const { onOk, form: { validateFields } } = this.props;


    validateFields( async  (err, values) => {
      if (!err) {
        const sid = await odoo.login(values)
        console.log(sid)
        console.log(odoo)

        if (sid){
          onOk()
        }

        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
      }
    });
  }



  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { visible  } = this.state;

    return (
      <div>
        <Button onClick={this.showModal}>登录</Button>

        <Modal title="登录"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form >
            <FormItem {...FormItemLayout} label="用户名">
              {getFieldDecorator('login', {
                /*  rules: [{ required: true }], */
                initialValue: 'admin',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="密码">
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





