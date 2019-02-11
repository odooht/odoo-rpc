import odoo from '@/odoo'

import React from 'react';
import { Card, Modal, Button, Form, Input, Divider } from 'antd';

import DescriptionList from '@/components/DescriptionList';
//import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormItemLayout from '@/layouts/FormItemLayout';

const { Description } = DescriptionList;


const FormItem = Form.Item;



class List extends React.Component {
  state = {
      visible: false,
      id: null,
      user: {},
  }


  async componentDidMount() {
      this.setState({user: odoo.user})
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
        const sid = await odoo.login(values)
        console.log(sid)
        console.log(odoo)

        if (sid){
          this.setState({user: odoo.user})
        }

        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
      }
    });
  }



  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { visible,user } = this.state;


    return (
      <div>
        <Button onClick={this.showModal}>登录</Button>
        <Card bordered={false}>
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="账号">{user.username}</Description>
            <Description term="名称">{user.name}</Description>
            <Description term="uid">{user.uid}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
            <Description term="sid">{user.session_id}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="公司信息" style={{ marginBottom: 32 }}>
            <Description term="公司id">{user.company_id}</Description>
          </DescriptionList>
        </Card>

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





