import odoo from '@/odoo'

import React from 'react';
import { Card, Modal, Button, Form, Input } from 'antd';
const FormItem = Form.Item;



class List extends React.Component {
  state = {
      visible: false,
      id: null,
      user: {}
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
        if( ! values.login ){
          values.login = 'admin'
          values.password = '123'
        }

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

    const {user_companies={}} = user
    const {current_company=[0,'']} = user_companies
    const [company_id, company_name] = current_company

    const data = [
      {key: 'username',     label: '账号', value: user.username},
      {key: 'name',         label: '名称', value: user.name},
      {key: 'server_version', label: '版本', value: user.server_version},
      {key: 'session_id',   label: 'sid', value: user.session_id},
      {key: 'uid',          label: 'uid', value: user.uid},
      {key: 'company_id',   label: 'company_id', value: company_id},
      {key: 'company_name', label: '公司', value: company_name},
    ]

    return (
      <div>
        <Button onClick={this.showModal}>登录</Button>
        <Card title="用户信息">
          {
            data.map((item)=>{
              return (
                <p key={item.key}> {item.label}: {item.value}</p>
              )
            })
          }
        </Card>

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





